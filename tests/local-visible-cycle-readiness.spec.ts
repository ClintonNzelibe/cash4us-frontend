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

test('member sees backend-backed qualification, promotional preview, and read-only recommitment readiness', async ({ page }) => {
  test.skip(!memberEmail || !memberPassword, 'Synthetic member credentials are required.')
  const issues: string[] = []
  page.on('pageerror', (error) => issues.push(`runtime: ${error.message}`))
  page.on('response', (response) => {
    if (response.url().includes('/api/') && response.status() >= 400) issues.push(`HTTP ${response.status()}: ${response.url()}`)
  })
  await signIn(page)
  await page.goto('/packages/my')
  await expect(page.getByText('Promotional qualification', { exact: true })).toBeVisible({ timeout: 30_000 })
  await expect(page.getByText('Recommitment readiness', { exact: true })).toBeVisible()
  await expect(page.getByText(/Funding plan|Plan your next membership cycle/)).toBeVisible()
  await expect(page.getByRole('button', { name: /confirm|activate|pay|reserve/i })).toHaveCount(0)
  expect(issues, issues.join('\n')).toEqual([])
})
