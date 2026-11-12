import { expect, test } from '@playwright/test'

const packages = [25, 50, 250, 500, 1000, 2000].map(price => ({
  id: `package-${price}`, name: `Cash4Us $${price}`, slug: `cash4us-${price}`,
  price: String(price), payment_amount: String(price === 50 ? 51 : price + 1),
  referral_bonus_percentage: '10', referral_points: 10, description: '',
  tenures: [30, 60, 90, 180].map((days, index) => ({
    id: `tenure-${price}-${days}`, duration_days: days,
    required_referrals: [4, 3, 1, 0][index], is_active: true,
  })),
}))

for (const width of [320, 768, 1440]) {
  test(`all pages and tenure requirements render at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.addInitScript(() => localStorage.setItem('cash4us_access_token', 'synthetic-catalogue'))
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.route('**/*', route => {
      const url = new URL(route.request().url())
      if (url.pathname.startsWith('/api/')) {
        if (url.pathname.endsWith('/users/me/')) return route.fulfill({ json: {
          id: 'synthetic-member', email: 'catalogue@example.test', username: 'catalogue',
          first_name: 'Catalogue', last_name: 'Test', is_admin: false, referral_code: 'TEST',
        } })
        if (url.pathname.endsWith('/packages/')) return route.fulfill({ json: {
          count: 6, next: url.search ? null : `${url.origin}${url.pathname}?page=2`,
          previous: null, results: url.search ? packages.slice(2) : packages.slice(0, 2),
        } })
        const detail = packages.find(pkg => url.pathname.endsWith(`/packages/${pkg.slug}/`))
        if (detail) return route.fulfill({ json: detail })
        return route.fulfill({ json: [] })
      }
      return ['127.0.0.1', 'localhost'].includes(url.hostname) ? route.continue() : route.abort()
    })
    await page.goto('/packages')
    await expect(page.locator('article')).toHaveCount(6)
    for (const pkg of packages) {
      const card = page.locator('article').filter({ has: page.getByRole('heading', { name: pkg.name, exact: true }) })
      await expect(card).toContainText('30 days: 4 required referrals')
      await expect(card).toContainText('180 days: 0 required referrals')
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: `../qa-artifacts/catalogue-${width}.png`, fullPage: true })
    for (const pkg of packages) {
      await page.goto(`/packages/${pkg.slug}`)
      await expect(page.getByRole('heading', { name: pkg.name, exact: true })).toBeVisible()
      for (const tenure of pkg.tenures) {
        const duration = tenure.duration_days === 180 ? '6 months' : `${tenure.duration_days} days`
        await page.getByRole('button', { name: new RegExp(`${duration}.*required referral`) }).click()
        await expect(page.getByText(new RegExp(`^Requires ${tenure.required_referrals} referral`))).toBeVisible()
      }
      if (pkg.price === '50') await expect(page.getByText('$51.00', { exact: true })).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
    expect(errors).toEqual([])
  })
}
