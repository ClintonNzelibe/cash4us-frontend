import { expect, test, type Page } from '@playwright/test'

const adminEmail = process.env.E2E_ADMIN_EMAIL
const adminPassword = process.env.E2E_ADMIN_PASSWORD

test.setTimeout(240_000)

async function signInAsAdmin(page: Page) {
  test.skip(
    !adminEmail || !adminPassword,
    'E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD are required for local visible tests.',
  )

  await page.goto('/login')
  await page.locator('#email').fill(adminEmail!)
  await page.locator('#password').fill(adminPassword!)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/admin$/, { timeout: 30_000 })
}

test('synthetic staff can render every implemented admin list and dashboard route', async ({ page }) => {
  const issues: string[] = []

  page.on('pageerror', (error) => issues.push(`runtime: ${error.message}`))
  page.on('response', (response) => {
    if (response.url().includes('/api/') && response.status() >= 400) {
      issues.push(`HTTP ${response.status()}: ${response.url()}`)
    }
  })

  await signInAsAdmin(page)

  for (const route of [
    '/admin', '/admin/members', '/admin/packages', '/admin/payments',
    '/admin/withdrawals', '/admin/tasks', '/admin/wallets',
    '/admin/transactions', '/admin/referrals',
    '/admin/rewards/points/accounts', '/admin/rewards/points/transactions',
    '/admin/rewards/leaderboard', '/admin/rewards/awards',
    '/admin/rewards/user-awards', '/admin/advertising/advertisers',
    '/admin/advertising/campaigns', '/admin/advertising/revenue',
    '/admin/community/pools', '/admin/support/tickets', '/admin/resources',
    '/admin/partners', '/admin/notifications', '/admin/audit',
  ]) {
    await page.goto(route)
    await expect(page).toHaveURL(new RegExp(`${route.replace('/', '\\/')}$`))
    await expect(page.locator('body')).not.toBeEmpty()
    await page.waitForTimeout(250)
  }

  expect(issues, issues.join('\n')).toEqual([])
})
