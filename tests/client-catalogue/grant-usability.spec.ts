import { expect, test } from '@playwright/test'

for (const width of [320, 1440]) {
  test(`admin understands and reviews a grant before activation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    let posts = 0
    await page.route('**/*', route => {
      const url = new URL(route.request().url())
      if (url.pathname.startsWith('/api/')) {
        if (route.request().method() === 'POST') { posts++; return route.fulfill({ status: 500, json: { detail: 'Synthetic failure: retry the same request.' } }) }
        if (url.pathname.endsWith('/grants/')) return route.fulfill({ json: { can_grant: true, can_retire: true, results: [] } })
        return route.fulfill({ json: [{ id: 'test-package', name: 'Cash4Us $50', price: '50', payment_amount: '51', is_active: true,
          tenures: [{ id: 'test-tenure', duration_days: 30, required_referrals: 4, is_active: true }] },
          { id: 'empty-package', name: 'Needs configuration', price: '25', is_active: true, tenures: [] }] })
      }
      return ['localhost', '127.0.0.1'].includes(url.hostname) ? route.continue() : route.abort()
    })
    await page.goto('/tests/client-catalogue/grant-preview.html')
    await page.getByRole('button', { name: 'Grant package', exact: true }).click()
    await expect(page.getByText(/Step 1 of 2/)).toBeVisible()
    await page.getByLabel('Package', { exact: true }).selectOption('empty-package')
    await expect(page.getByText(/This package has no active membership durations/)).toBeVisible()
    await page.getByLabel('Package', { exact: true }).selectOption('test-package')
    await expect(page.getByLabel('Tenure')).toContainText('30 days · 4 required referrals')
    await page.getByLabel('Tenure').selectOption('test-tenure')
    await page.getByLabel('Purchase / case reference').fill('CLIENT-001')
    await page.getByLabel('Reason', { exact: true }).fill('Approved client usability test')
    await page.getByLabel('Test run', { exact: true }).fill('client-20261112')
    await page.getByRole('button', { name: 'Review grant', exact: true }).click()
    await expect(page.getByText(/Step 2 of 2/)).toBeVisible()
    await expect(page.getByText('Admin grant — no payment collected', { exact: true })).toBeVisible()
    await expect(page.getByText('Designated test run: client-20261112')).toBeVisible()
    expect(posts).toBe(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: `../qa-artifacts/grant-friendly-${width}.png`, fullPage: true })
    await page.getByRole('button', { name: 'Confirm package grant', exact: true }).click()
    await expect(page.getByRole('alert')).toContainText('Synthetic failure')
    await expect(page.getByRole('button', { name: 'Confirm package grant', exact: true })).toBeEnabled()
    expect(posts).toBe(1)
  })
}
