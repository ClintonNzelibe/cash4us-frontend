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

test('withdrawal form displays the 10% fee and respects the current server eligibility restriction', async ({ page }) => {
  test.skip(!memberEmail || !memberPassword, 'Synthetic member credentials are required.')
  await signIn(page)
  await page.goto('/withdrawals')
  await expect(page.getByText(/Requests can be submitted every Thursday/)).toBeVisible()
  await page.getByRole('button', { name: 'Request Withdrawal' }).click()
  await page.locator('#withdrawal-address').fill('TSyntheticVisibleE2EWalletAddress')
  await page.locator('#withdrawal-amount').fill('10')
  await expect(page.getByText('Administrative fee')).toBeVisible()
  await expect(page.getByText('$1.00')).toBeVisible()
  await expect(page.getByText('$9.00')).toBeVisible()
  await page.getByRole('button', { name: 'Request Withdrawal' }).last().click()
  await expect(page.getByText('Withdrawals are only available on Thursdays until 5:00 PM.')).toBeVisible({ timeout: 30_000 })
})
