import { test, expect } from '@playwright/test';
import happoPlaywright from 'happo-playwright';

test.afterAll(async () => {
});

test('start page', async ({ page, context }) => {
  await happoPlaywright.init(context);
  await page.goto('http://localhost:4321');

  await page.getByText('Dominic Rendone');
  const html = page.locator('body');
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('networkidle')

  await happoPlaywright.screenshot(page, html, {
    component: 'whole page',
    variant: 'default',
  });
  await happoPlaywright.finish();
});


test('has title', async ({ page }) => {
  await page.goto('http://localhost:4321');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Dashboard/);
});

// test('get started link', async ({ page }) => {
//   await page.goto('http://localhost:4321');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
