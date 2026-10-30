import { expect, test, type Page } from '@playwright/test'

const paymentId = process.env.E2E_REFERRAL_PAYMENT_ID
const adminEmail = process.env.E2E_ADMIN_EMAIL
const adminPassword = process.env.E2E_ADMIN_PASSWORD

test.setTimeout(60_000)

async function signIn(page: Page) {
  await page.goto('/login')
  await page.locator('#email').fill(adminEmail!)
  await page.locator('#password').fill(adminPassword!)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/admin$/, { timeout: 30_000 })
}

test('staff approves the existing synthetic referred-member payment in visible Chrome', async ({ page }) => {
  test.skip(!paymentId || !adminEmail || !adminPassword, 'Synthetic pending payment and admin credentials are required.')
  await signIn(page)
  await page.goto(`/admin/payments/${paymentId}`)
  await expect(page.getByText('Payment Details')).toBeVisible()
  await page.getByRole('button', { name: 'Approve', exact: true }).click()
  await page.getByPlaceholder('Add any approval remarks...').fill('Synthetic visible referral E2E approval.')
  await page.getByRole('button', { name: 'Approve Payment' }).click()
  await expect(page.getByText('Approved', { exact: true })).toBeVisible({ timeout: 30_000 })
})
