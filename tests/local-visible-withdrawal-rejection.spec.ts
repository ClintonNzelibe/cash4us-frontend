import { expect, test } from '@playwright/test'

const withdrawalId = '49377b17-7436-4ba6-b3eb-9e57308d7e67'

test('admin rejects the separate isolated synthetic Thursday withdrawal', async ({ page }) => {
  await page.goto('/login')
  await page.locator('#email').fill('e2e-admin@cash4us.local')
  await page.locator('#password').fill('VisibleTest42')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/admin$/, { timeout: 30_000 })

  await page.goto(`/admin/withdrawals/${withdrawalId}`)
  await expect(page.getByRole('button', { name: 'Reject Withdrawal' })).toBeVisible({ timeout: 30_000 })
  await page.getByRole('button', { name: 'Reject Withdrawal' }).click()
  await page.getByPlaceholder('Enter the reason for rejecting this withdrawal...').fill('Visible local E2E rejection')
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.getByText('REJECTED', { exact: true })).toBeVisible({ timeout: 30_000 })
})
