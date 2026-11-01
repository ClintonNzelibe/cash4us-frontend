import { expect, test, type Page } from './fullqa/fixtures'

const password = 'VisibleE2E42'
async function signIn(page: Page, username: string) {
  await page.goto('/login')
  await page.locator('#email').fill(`${username}@cash4us.local`)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 30_000 })
}

test('synthetic missed, expired, and excluded promotional cycles show backend reasons', async ({ page }) => {
  test.setTimeout(180_000)
  const cases = [
    ['visible-e2e-30-missed', /Missed|Not eligible yet/i],
    ['visible-e2e-30-expired', 'The promotional qualification deadline has passed.'],
    ['visible-e2e-90-excluded', 'This tenure is not eligible for the promotional qualification.'],
    ['visible-e2e-180-excluded', 'This tenure is not eligible for the promotional qualification.'],
  ] as const
  for (const [username, message] of cases) {
    await signIn(page, username)
    await page.goto('/packages/my')
    await expect(page.getByText('Promotional qualification', { exact: true })).toBeVisible()
    await expect(page.getByText(message, { exact: typeof message === 'string' })).toBeVisible({ timeout: 30_000 })
    await page.getByRole('button', { name: 'Logout' }).click()
  }
})
