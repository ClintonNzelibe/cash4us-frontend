import { expect, test } from '@playwright/test'

const referralCode = 'CODE&42'
const referralLink = 'https://cash4us.org/register?ref=CODE%2642'

test.beforeEach(async ({ context, page }) => {
  await context.grantPermissions([
    'clipboard-read',
    'clipboard-write',
  ])

  await page.addInitScript(() => {
    localStorage.setItem('cash4us_access_token', 'test-access-token')
  })

  await page.route('**/api/users/me/', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        id: '00000000-0000-0000-0000-000000000001',
        email: 'member@example.com',
        username: 'member',
        first_name: 'Member',
        last_name: 'Test',
        referral_code: referralCode,
        is_admin: false,
        date_joined: '2026-01-01T00:00:00Z',
      }),
    })
  })

  await page.route('**/api/v1/referrals/', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: '[]',
    })
  })
})

test('copies and shares the configured referral URL', async ({ page }) => {
  await page.goto('/referrals')

  await expect(page.getByText(referralLink)).toBeVisible()

  await page.getByRole('button', { name: 'Copy Link' }).click()
  await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText()))
    .toBe(referralLink)

  // Chromium uses the component's clipboard fallback when Web Share is absent.
  await page.getByRole('button', { name: 'Share' }).click()
  await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText()))
    .toBe(referralLink)
})
