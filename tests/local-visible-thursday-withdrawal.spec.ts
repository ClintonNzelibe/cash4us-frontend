import { expect, test } from '@playwright/test'

test('synthetic Thursday withdrawal shows fee and creates one pending request', async ({ page }) => {
  await page.goto('/login')
  await page.locator('#email').fill('visible-e2e-withdrawal@cash4us.local')
  await page.locator('#password').fill('VisibleE2E42')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 30_000 })
  await page.goto('/withdrawals')
  await page.getByRole('button', { name: 'Request Withdrawal' }).click()
  await page.locator('#withdrawal-address').fill('TSyntheticThursdayWithdrawalAddress')
  await page.locator('#withdrawal-amount').fill('20')
  const requestForm = page.locator('form')
  await expect(requestForm.getByText('$2.00', { exact: true })).toBeVisible()
  await expect(requestForm.getByText('$18.00', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Request Withdrawal' }).last().click()
  await expect(page.getByRole('cell', { name: 'PENDING', exact: true })).toBeVisible({ timeout: 30_000 })
})
