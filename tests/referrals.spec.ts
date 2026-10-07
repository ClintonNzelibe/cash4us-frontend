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

test('passes a referral URL code through registration', async ({ page }) => {
  let registrationPayload: Record<string, unknown> | null = null

  await page.route('**/api/users/register/', async (route) => {
    registrationPayload = route.request().postDataJSON()
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({}),
    })
  })

  await page.goto('/register?ref=refer123')

  await expect(page.locator('#referral_code')).toHaveValue('REFER123')
  await page.locator('#first_name').fill('Referred')
  await page.locator('#last_name').fill('Member')
  await page.locator('#username').fill('referred-member')
  await page.locator('#email').fill('referred@example.com')
  await page.locator('#password').fill('Strongpass1')
  await page.locator('#confirm_password').fill('Strongpass1')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect.poll(() => registrationPayload).not.toBeNull()
  expect(registrationPayload?.referral_code).toBe('REFER123')
})
