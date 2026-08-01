const { test, expect } = require('@playwright/test');

test('sanity check - page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Login/);
});