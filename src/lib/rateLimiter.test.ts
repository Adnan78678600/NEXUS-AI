import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRateLimiter, debounce, withTimeout, withRetry } from './rateLimiter';

describe('createRateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows requests within limit', () => {
    const limiter = createRateLimiter('test1', { maxRequests: 3, windowMs: 1000 });
    
    expect(limiter.canMakeRequest()).toBe(true);
    limiter.recordRequest();
    expect(limiter.canMakeRequest()).toBe(true);
    limiter.recordRequest();
    expect(limiter.canMakeRequest()).toBe(true);
    limiter.recordRequest();
    expect(limiter.canMakeRequest()).toBe(false);
  });

  it('resets after window expires', () => {
    const limiter = createRateLimiter('test2', { maxRequests: 1, windowMs: 1000 });
    
    limiter.recordRequest();
    expect(limiter.canMakeRequest()).toBe(false);
    
    vi.advanceTimersByTime(1001);
    expect(limiter.canMakeRequest()).toBe(true);
  });

  it('returns correct remaining requests', () => {
    const limiter = createRateLimiter('test3', { maxRequests: 5, windowMs: 1000 });
    
    expect(limiter.getRemainingRequests()).toBe(5);
    limiter.recordRequest();
    limiter.recordRequest();
    expect(limiter.getRemainingRequests()).toBe(3);
  });

  it('resets correctly', () => {
    const limiter = createRateLimiter('test4', { maxRequests: 2, windowMs: 1000 });
    
    limiter.recordRequest();
    limiter.recordRequest();
    expect(limiter.canMakeRequest()).toBe(false);
    
    limiter.reset();
    expect(limiter.canMakeRequest()).toBe(true);
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays function execution', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);
    
    debouncedFn();
    expect(fn).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets timer on subsequent calls', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);
    
    debouncedFn();
    vi.advanceTimersByTime(50);
    debouncedFn();
    vi.advanceTimersByTime(50);
    
    expect(fn).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('withTimeout', () => {
  it('resolves if promise completes in time', async () => {
    const promise = Promise.resolve('success');
    const result = await withTimeout(promise, 1000);
    expect(result).toBe('success');
  });

  it('rejects if promise times out', async () => {
    const promise = new Promise((resolve) => setTimeout(resolve, 2000));
    await expect(withTimeout(promise, 100, 'Timed out')).rejects.toThrow('Timed out');
  });
});

describe('withRetry', () => {
  it('succeeds on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await withRetry(fn, { maxRetries: 3 });
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');
    
    const result = await withRetry(fn, { maxRetries: 3, delayMs: 10, backoff: false });
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('throws after max retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fail'));
    
    await expect(withRetry(fn, { maxRetries: 2, delayMs: 10 })).rejects.toThrow('always fail');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
