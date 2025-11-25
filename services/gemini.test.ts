import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analyzeIdentity, generateTrendForecast, generateSystemLog } from './gemini';

describe('gemini service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('analyzeIdentity', () => {
    it('should return fallback when API_KEY is not set', async () => {
      delete process.env.API_KEY;
      const result = await analyzeIdentity('TestUser');
      expect(result).toContain('IDENTITY_UNKNOWN');
    });

    it('should handle empty input gracefully', async () => {
      const result = await analyzeIdentity('');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('generateTrendForecast', () => {
    it('should return fallback when API_KEY is not set', async () => {
      delete process.env.API_KEY;
      const result = await generateTrendForecast();
      expect(result).toContain('FORECAST');
    });
  });

  describe('generateSystemLog', () => {
    it('should return fallback when API_KEY is not set', async () => {
      delete process.env.API_KEY;
      const result = await generateSystemLog();
      expect(result).toContain('SYSTEM');
    });
  });
});
