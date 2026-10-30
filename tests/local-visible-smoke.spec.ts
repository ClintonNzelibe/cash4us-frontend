import { expect, test, type Page } from '@playwright/test'

const memberEmail = process.env.E2E_MEMBER_EMAIL
const memberPassword = process.env.E2E_MEMBER_PASSWORD
const referralCode = process.env.E2E_REFERRAL_CODE

test.setTimeout(120_000)

function requireMemberCredentials() {
  test.skip(
    !memberEmail || !memberPassword,
    'E2E_MEMBER_EMAIL and E2E_MEMBER_PASSWORD are required for local visible tests.',
  )
}

async function signInAsMember(page: Page) {
  await page.goto('/login')
  await page.locator('#email').fill(memberEmail!)
  await page.locator('#password').fill(memberPassword!)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 30_000 })
}

test('registration validates invalid input and accepts a synthetic referral', async ({ page }) => {
  test.skip(!referralCode, 'E2E_REFERRAL_CODE is required for referral registration.')
  await page.goto(`/register?ref=${referralCode}`)
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page.getByText('First name is required.')).toBeVisible()
  await expect(page.getByText('Password is required.')).toBeVisible()

  const unique = Date.now()
  await page.locator('#first_name').fill('Visual')
  await page.locator('#last_name').fill('Member')
  await page.locator('#username').fill(`visual${unique}`)
  await page.locator('#email').fill(`visual${unique}@cash4us.local`)
  await page.locator('#password').fill('VisibleTest42')
  await page.locator('#confirm_password').fill('VisibleTest42')
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page.getByText('Account created successfully.')).toBeVisible({
    timeout: 60_000,
  })
  await expect(page).toHaveURL(/\/login$/, { timeout: 30_000 })
})

test('member login, protected-route isolation, and desktop route rendering', async ({ page }) => {
  requireMemberCredentials()
  await signInAsMember(page)

  await page.goto('/admin')
  await expect(page).toHaveURL(/\/dashboard$/)

  for (const route of [
    '/dashboard', '/packages', '/packages/my', '/wallet', '/transactions',
    '/referrals', '/tasks', '/withdrawals', '/notifications', '/profile',
    '/support', '/resources', '/partners', '/community',
  ]) {
    await page.goto(route)
    await expect(page).toHaveURL(new RegExp(`${route.replace('/', '\\/')}$`))
    await expect(page.locator('body')).not.toBeEmpty()
  }
})

test('unauthenticated visitor is redirected from protected pages', async ({ page }) => {
  await page.goto('/wallet')
  await expect(page).toHaveURL(/\/login$/)
})

test('member dashboard remains usable at a mobile viewport', async ({ page }) => {
  requireMemberCredentials()
  await page.setViewportSize({ width: 390, height: 844 })
  await signInAsMember(page)
  await expect(page.getByText(/Member Dashboard/i)).toBeVisible()
  expect(await page.evaluate(() => (
    document.documentElement.scrollWidth <= window.innerWidth
  ))).toBe(true)
})
