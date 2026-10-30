import { expect, test, type Browser, type Page } from '@playwright/test'

const memberEmail = process.env.E2E_MEMBER_EMAIL
const memberPassword = process.env.E2E_MEMBER_PASSWORD
const adminEmail = process.env.E2E_ADMIN_EMAIL
const adminPassword = process.env.E2E_ADMIN_PASSWORD
const submissionId = process.env.E2E_SUBMISSION_ID

test.setTimeout(180_000)

async function signIn(page: Page, email: string, password: string, expectedUrl: RegExp) {
  await page.goto('/login')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(expectedUrl, { timeout: 30_000 })
}

test('synthetic pending task proof is approved in admin UI and reflected in member wallet views', async ({ browser, page }) => {
  test.skip(!memberEmail || !memberPassword || !adminEmail || !adminPassword || !submissionId)
  const adminContext = await browser.newContext()
  const adminPage = await adminContext.newPage()
  await signIn(adminPage, adminEmail!, adminPassword!, /\/admin$/)
  await adminPage.goto(`/admin/tasks/submissions/${submissionId}`)
  const approveButton = adminPage.getByRole('button', {
    name: 'Approve & complete',
  })
  if (await approveButton.isVisible()) {
    await approveButton.click()
    await adminPage.getByRole('button', { name: 'Confirm' }).click()
  }
  await expect(adminPage.getByText(/COMPLETED|Approved/)).toBeVisible({
    timeout: 30_000,
  })
  await adminContext.close()

  await signIn(page, memberEmail!, memberPassword!, /\/dashboard$/)
  await page.goto('/tasks')
  await expect(page.getByText('COMPLETED', { exact: true })).toBeVisible({ timeout: 30_000 })
  await page.goto('/wallet')
  await expect(page.locator('body')).not.toContainText('Unable to load')
  await page.goto('/transactions')
  await expect(page.locator('body')).not.toContainText('Unable to load')
})
