interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
}

interface RateLimiterState {
  requests: number[];
}

const limiters = new Map<string, RateLimiterState>();

export function createRateLimiter(key: string, options: RateLimiterOptions) {
  const { maxRequests, windowMs } = options;

  if (!limiters.has(key)) {
    limiters.set(key, { requests: [] });
  }

  return {
    canMakeRequest(): boolean {
      const state = limiters.get(key)!;
      const now = Date.now();
      
      state.requests = state.requests.filter((time) => now - time < windowMs);
      
      return state.requests.length < maxRequests;
    },

    recordRequest(): void {
      const state = limiters.get(key)!;
      state.requests.push(Date.now());
    },

    getRemainingRequests(): number {
      const state = limiters.get(key)!;
      const now = Date.now();
      const validRequests = state.requests.filter((time) => now - time < windowMs);
      return Math.max(0, maxRequests - validRequests.length);
    },

    getTimeUntilReset(): number {
      const state = limiters.get(key)!;
      if (state.requests.length === 0) return 0;
      
      const oldestRequest = Math.min(...state.requests);
      const resetTime = oldestRequest + windowMs;
      return Math.max(0, resetTime - Date.now());
    },

    reset(): void {
      limiters.set(key, { requests: [] });
    },
  };
}

export const geminiRateLimiter = createRateLimiter('gemini', {
  maxRequests: 10,
  windowMs: 60 * 1000, // 10 requests per minute
});

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Operation timed out'
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; delayMs?: number; backoff?: boolean } = {}
): Promise<T> {
  const { maxRetries = 3, delayMs = 1000, backoff = true } = options;
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        const delay = backoff ? delayMs * Math.pow(2, attempt) : delayMs;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
