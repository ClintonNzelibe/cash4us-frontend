import { expect, test, type Page } from './fullqa/fixtures'

const password = 'VisibleE2E42'

async function signIn(page: Page, username: string) {
  await page.goto('/login')
  await page.locator('#email').fill(`${username}@cash4us.local`)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 30_000 })
}

test('qualified synthetic 30-day and 60-day fixtures render promotional qualification in Chrome', async ({ page }) => {
  test.setTimeout(120_000)
  for (const username of ['visible-e2e-30-qualified', 'visible-e2e-60-qualified']) {
    await signIn(page, username)
    await page.goto('/packages/my')
    await expect(page.getByText('Promotional qualification', { exact: true })).toBeVisible()
    await expect(page.getByText('Eligible', { exact: true })).toBeVisible({ timeout: 30_000 })
    await page.getByRole('button', { name: 'Logout' }).click()
  }
})
