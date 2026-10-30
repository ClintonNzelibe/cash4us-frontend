import { expect, test, type Browser, type Page } from '@playwright/test'

const memberEmail = process.env.E2E_MEMBER_EMAIL
const memberPassword = process.env.E2E_MEMBER_PASSWORD
const adminEmail = process.env.E2E_ADMIN_EMAIL
const adminPassword = process.env.E2E_ADMIN_PASSWORD

test.setTimeout(180_000)

async function signIn(page: Page, email: string, password: string, expectedUrl: RegExp) {
  await page.goto('/login')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(expectedUrl, { timeout: 30_000 })
}

async function getPendingPaymentId(page: Page) {
  return page.evaluate(async () => {
    const token = localStorage.getItem('cash4us_access_token')
    const response = await fetch('http://127.0.0.1:8000/api/payments/', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const payments = await response.json()
    const pending = payments.find((payment: { status: string }) => (
      payment.status === 'PENDING'
    ))
    return pending?.id as string | undefined
  })
}

test('synthetic member payment is approved through the visible admin UI and activates the payment status', async ({ browser, page }) => {
  test.skip(
    !memberEmail || !memberPassword || !adminEmail || !adminPassword,
    'Synthetic member and admin credentials are required.',
  )

  await signIn(page, memberEmail!, memberPassword!, /\/dashboard$/)
  await page.goto('/packages/standard')
  await page.getByRole('button', { name: 'Continue to Payment' }).click()
  await expect(page).toHaveURL(/\/packages\/standard\/payment$/)
  await page.getByRole('button', { name: 'Get payment instructions' }).click()
  await expect(page.getByText('Pending verification')).toBeVisible({ timeout: 30_000 })

  const paymentId = await getPendingPaymentId(page)
  expect(paymentId).toBeTruthy()

  const adminContext = await browser.newContext()
  const adminPage = await adminContext.newPage()
  await signIn(adminPage, adminEmail!, adminPassword!, /\/admin$/)
  await adminPage.goto(`/admin/payments/${paymentId}`)
  await expect(adminPage.getByText('Payment Details')).toBeVisible()
  await adminPage.getByRole('button', { name: 'Approve', exact: true }).click()
  await adminPage.getByPlaceholder('Add any approval remarks...').fill(
    'Synthetic visible E2E approval.',
  )
  await adminPage.getByRole('button', { name: 'Approve Payment' }).click()
  await expect(adminPage.getByText('Approved', { exact: true })).toBeVisible({
    timeout: 30_000,
  })
  await adminContext.close()

  await page.getByRole('button', { name: 'Refresh status' }).click()
  await expect(page.getByText('Approved', { exact: true })).toBeVisible({
    timeout: 30_000,
  })
  await expect(page.getByText(/package is active/i)).toBeVisible()
})
