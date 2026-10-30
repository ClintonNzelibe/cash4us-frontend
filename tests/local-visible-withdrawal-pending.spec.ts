import { expect, test } from '@playwright/test'

test('existing synthetic Thursday withdrawal is shown as pending in history', async ({ page }) => {
  await page.goto('/login')
  await page.locator('#email').fill('visible-e2e-withdrawal@cash4us.local')
  await page.locator('#password').fill('VisibleE2E42')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 30_000 })
  await page.goto('/withdrawals')
  await expect(page.getByRole('cell', { name: 'PENDING', exact: true })).toBeVisible({ timeout: 30_000 })
})
