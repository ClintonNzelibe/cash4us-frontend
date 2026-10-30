import { expect, test } from '@playwright/test'

const withdrawalId = 'ae954b7f-0c36-4f17-9689-237da4f9d412'

test('admin approves the isolated synthetic Thursday withdrawal once', async ({ page }) => {
  page.on('console', (message) => {
    if (message.type() === 'error') console.log(`console: ${message.text()}`)
  })
  page.on('response', (response) => {
    if (response.url().includes('/withdrawals/')) {
      console.log(`withdrawal response: ${response.status()} ${response.url()}`)
    }
  })
  await page.goto('/login')
  await page.locator('#email').fill('e2e-admin@cash4us.local')
  await page.locator('#password').fill('VisibleTest42')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/admin$/, { timeout: 30_000 })

  await page.goto(`/admin/withdrawals/${withdrawalId}`)
  console.log(`detail body: ${await page.locator('body').innerText()}`)
  await expect(page.getByRole('button', { name: 'Approve Withdrawal' })).toBeVisible({ timeout: 30_000 })
  await page.getByRole('button', { name: 'Approve Withdrawal' }).click()
  await page.getByPlaceholder('Add remarks if needed...').fill('Visible local E2E approval')
  await page.getByRole('button', { name: 'Confirm' }).click()
  await expect(page.getByText('APPROVED', { exact: true })).toBeVisible({ timeout: 30_000 })
})
