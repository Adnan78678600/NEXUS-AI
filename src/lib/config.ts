const getGeminiKey = (): string | undefined => {
  try {
    // Vite injects these at build time via define in vite.config.ts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const proc = (globalThis as any).process;
    return proc?.env?.GEMINI_API_KEY || proc?.env?.API_KEY || undefined;
  } catch {
    return undefined;
  }
};

const getSentryDsn = (): string => {
  try {
    return import.meta.env?.VITE_SENTRY_DSN || '';
  } catch {
    return '';
  }
};

const getNodeEnv = (): string => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (globalThis as any).process?.env?.NODE_ENV || 'development';
  } catch {
    return 'development';
  }
};

export const config = {
  geminiApiKey: getGeminiKey(),
  sentryDsn: getSentryDsn(),
  isDev: getNodeEnv() === 'development',
  isProd: getNodeEnv() === 'production',
  isTest: getNodeEnv() === 'test',
} as const;

export const hasGeminiKey = (): boolean => {
  return Boolean(config.geminiApiKey && config.geminiApiKey.length > 0);
};
