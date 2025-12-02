import * as Sentry from '@sentry/react';
import { config } from './config';

let isInitialized = false;

export function initSentry(): void {
  if (isInitialized || !config.sentryDsn) {
    return;
  }

  try {
    Sentry.init({
      dsn: config.sentryDsn,
      environment: config.isProd ? 'production' : 'development',
      enabled: config.isProd,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: config.isProd ? 1.0 : 0,
      
      beforeSend(event) {
        if (config.isDev) {
          console.warn('[Sentry] Would send event:', event);
          return null;
        }
        return event;
      },

      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'Non-Error promise rejection captured',
      ],
    });

    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize Sentry:', error);
  }
}

export function captureError(error: Error, context?: Record<string, unknown>): void {
  if (config.isDev) {
    console.error('[Error]', error, context);
  }

  if (isInitialized) {
    Sentry.captureException(error, {
      extra: context,
    });
  }
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
  if (config.isDev) {
    console.warn(`[${level}]`, message);
  }

  if (isInitialized) {
    Sentry.captureMessage(message, level);
  }
}

export function setUser(user: { id: string; email?: string } | null): void {
  if (isInitialized) {
    Sentry.setUser(user);
  }
}

export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb): void {
  if (isInitialized) {
    Sentry.addBreadcrumb(breadcrumb);
  }
}

export { Sentry };
