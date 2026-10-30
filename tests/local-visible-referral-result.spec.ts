import { expect, test, type Page } from '@playwright/test'

const memberEmail = process.env.E2E_MEMBER_EMAIL
const memberPassword = process.env.E2E_MEMBER_PASSWORD

test.setTimeout(60_000)

async function signIn(page: Page) {
  await page.goto('/login')
  await page.locator('#email').fill(memberEmail!)
  await page.locator('#password').fill(memberPassword!)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 30_000 })
}

test('referrer sees the paid referral and 10% bonus in visible Chrome', async ({ page }) => {
  test.skip(!memberEmail || !memberPassword, 'Synthetic referrer credentials are required.')
  await signIn(page)
  await page.goto('/referrals')
  await expect(page.getByText('Paid Referrals')).toBeVisible()
  await expect(page.getByText('Earned Bonuses', { exact: true })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'PAID', exact: true })).toBeVisible({ timeout: 30_000 })
  await expect(page.getByText('10.00%')).toBeVisible()
})
