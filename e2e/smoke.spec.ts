import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Neural Dither AI/);
  });

  test('navbar is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByText('NEXUS')).toBeVisible();
  });

  test('navigation items are clickable', async ({ page }) => {
    await page.goto('/');
    const navItem = page.getByText('00_ROOT');
    await expect(navItem).toBeVisible();
    await navItem.click();
  });

  test('3D canvas loads', async ({ page }) => {
    await page.goto('/');
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });

  test('mobile menu toggle works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const menuButton = page.getByRole('button', { name: /menu/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });

  test('audio toggle button exists', async ({ page }) => {
    await page.goto('/');
    const audioButton = page.getByRole('button', { name: /audio/i });
    await expect(audioButton).toBeVisible();
  });

  test('page has no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000);
    
    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('404')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('skip link exists for accessibility', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.getByRole('link', { name: /skip/i });
    await expect(skipLink).toBeAttached();
  });
});

test.describe('Performance', () => {
  test('page loads within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - start;
    
    expect(loadTime).toBeLessThan(5000);
  });
});
