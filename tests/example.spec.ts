import { test, expect } from '@playwright/test';
import happoPlaywright from 'happo-playwright';

test.afterAll(async () => {
});

test('start page', async ({ page, context }) => {
  await happoPlaywright.init(context);
  await page.goto('http://localhost:4321');

  const html = page.locator('body');
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('networkidle')

  await happoPlaywright.screenshot(page, html, {
    component: 'whole page',
    variant: 'default',
  });
  await happoPlaywright.finish();
});

