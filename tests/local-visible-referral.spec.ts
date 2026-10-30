import { expect, test, type Browser, type Page } from '@playwright/test'

const referredEmail = process.env.E2E_REFERRED_EMAIL
const referredPassword = process.env.E2E_REFERRED_PASSWORD
const referrerEmail = process.env.E2E_MEMBER_EMAIL
const referrerPassword = process.env.E2E_MEMBER_PASSWORD
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

async function pendingPaymentId(page: Page) {
  return page.evaluate(async () => {
    const token = localStorage.getItem('cash4us_access_token')
    const response = await fetch('http://127.0.0.1:8000/api/payments/', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const payments = await response.json()
    return payments.find((payment: { status: string }) => payment.status === 'PENDING')?.id as string | undefined
  })
}

test('referred synthetic member activates visibly and credits one 10% referral bonus', async ({ browser, page }) => {
  test.skip(
    !referredEmail || !referredPassword || !referrerEmail || !referrerPassword || !adminEmail || !adminPassword,
    'Synthetic referred-member, referrer, and admin credentials are required.',
  )

  await signIn(page, referredEmail!, referredPassword!, /\/dashboard$/)
  let paymentId = await pendingPaymentId(page)
  if (!paymentId) {
    await page.goto('/packages/standard')
    await page.getByRole('button', { name: 'Continue to Payment' }).click()
    await page.getByRole('button', { name: 'Get payment instructions' }).click()
    await expect(page.getByText('Pending verification')).toBeVisible({ timeout: 30_000 })
    paymentId = await pendingPaymentId(page)
  }
  expect(paymentId).toBeTruthy()

  const adminContext = await browser.newContext()
  const adminPage = await adminContext.newPage()
  await signIn(adminPage, adminEmail!, adminPassword!, /\/admin$/)
  await adminPage.goto(`/admin/payments/${paymentId}`)
  await adminPage.getByRole('button', { name: 'Approve', exact: true }).click()
  await adminPage.getByPlaceholder('Add any approval remarks...').fill('Synthetic visible referral E2E approval.')
  await adminPage.getByRole('button', { name: 'Approve Payment' }).click()
  await expect(adminPage.getByText('Approved', { exact: true })).toBeVisible({ timeout: 30_000 })
  await adminContext.close()

  await signIn(page, referrerEmail!, referrerPassword!, /\/dashboard$/)
  await page.goto('/referrals')
  await expect(page.getByText('Paid Referrals')).toBeVisible()
  await expect(page.getByText('Earned Bonuses')).toBeVisible()
  await expect(page.getByText('PAID', { exact: true })).toBeVisible({ timeout: 30_000 })
  await expect(page.getByText('10.00%')).toBeVisible()
})
