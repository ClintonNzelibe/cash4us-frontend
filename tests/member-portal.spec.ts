import { expect, test } from '@playwright/test'

const accessToken = process.env.E2E_MEMBER_ACCESS_TOKEN

test('login screen renders', async ({ page }) => {
  await page.goto('/login')

  await expect(
    page.getByRole('heading', { name: 'Welcome back', exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: /sign in|login/i })).toBeVisible()
})

const memberRoutes = [
  '/dashboard',
  '/packages',
  '/packages/my',
  '/wallet',
  '/transactions',
  '/referrals',
  '/tasks',
  '/withdrawals',
  '/resources',
  '/partners',
  '/community',
  '/support',
  '/notifications',
  '/profile',
]

for (const route of memberRoutes) {
  test(`member route ${route} has no runtime or API errors`, async ({ page }) => {
    test.skip(!accessToken, 'E2E_MEMBER_ACCESS_TOKEN is required for member pages.')
    test.setTimeout(15_000)

    const issues: string[] = []

    page.on('pageerror', (error) => {
      issues.push(`runtime: ${error.message}`)
    })
    page.on('console', (message) => {
      if (message.type() === 'error') {
        issues.push(`console: ${message.text()}`)
      }
    })
    page.on('response', (response) => {
      if (response.status() >= 400) {
        issues.push(`HTTP ${response.status()}: ${response.url()}`)
      }
    })

    await page.addInitScript((token) => {
      localStorage.setItem('cash4us_access_token', token)
    }, accessToken)

    try {
      await page.goto(route, {
        waitUntil: 'domcontentloaded',
        timeout: 10_000,
      })
    } catch (error) {
      issues.push(`navigation: ${route} failed: ${String(error)}`)
      expect(issues, issues.join('\n')).toEqual([])
      return
    }
    await page.waitForTimeout(750)

    if (!page.url().includes(route)) {
      issues.push(`navigation: ${route} redirected to ${page.url()}`)
    }

    expect(issues, issues.join('\n')).toEqual([])
  })
}
