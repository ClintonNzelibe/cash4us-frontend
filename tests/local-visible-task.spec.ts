import { expect, test, type Browser, type Page } from '@playwright/test'

const memberEmail = process.env.E2E_MEMBER_EMAIL
const memberPassword = process.env.E2E_MEMBER_PASSWORD
const adminEmail = process.env.E2E_ADMIN_EMAIL
const adminPassword = process.env.E2E_ADMIN_PASSWORD

test.setTimeout(240_000)

async function signIn(page: Page, email: string, password: string, expectedUrl: RegExp) {
  await page.goto('/login')
  await page.locator('#email').fill(email)
  await page.locator('#password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(expectedUrl, { timeout: 30_000 })
}

test('synthetic task creation, assignment, proof submission, and earning approval work through visible UI', async ({ browser, page }) => {
  test.skip(
    !memberEmail || !memberPassword || !adminEmail || !adminPassword,
    'Synthetic member and admin credentials are required.',
  )
  const today = new Date().toISOString().slice(0, 10)
  const taskTitle = `Visible task ${Date.now()}`

  const adminContext = await browser.newContext()
  const adminPage = await adminContext.newPage()
  await signIn(adminPage, adminEmail!, adminPassword!, /\/admin$/)
  await adminPage.goto('/admin/tasks/new')
  await adminPage.getByPlaceholder('Enter task title').fill(taskTitle)
  await adminPage.getByPlaceholder('Describe what members need to do...').fill('Submit synthetic visible proof.')
  await adminPage.getByPlaceholder('0.00').fill('1.25')
  await adminPage.locator('input[type="number"]').nth(1).fill('2')
  await adminPage.locator('input[type="date"]').nth(0).fill(today)
  await adminPage.locator('input[type="date"]').nth(1).fill(today)
  await adminPage.getByRole('button', { name: 'Create Task' }).click()
  await expect(adminPage.getByRole('heading', { name: taskTitle })).toBeVisible({ timeout: 30_000 })

  await signIn(page, memberEmail!, memberPassword!, /\/dashboard$/)
  await page.goto('/tasks')
  await expect(page.getByText(taskTitle)).toBeVisible({ timeout: 30_000 })
  await page.getByRole('button', { name: 'Submit Proof' }).click()
  await page.getByRole('button', { name: 'Other proof' }).click()
  await page.locator('#proof-details').fill('Synthetic visual E2E proof.')
  await page.getByRole('button', { name: 'Submit Proof' }).last().click()
  await expect(page.getByRole('heading', { name: taskTitle })).toBeVisible()

  const submissionId = await page.evaluate(async (title) => {
    const token = localStorage.getItem('cash4us_access_token')
    const response = await fetch('http://127.0.0.1:8000/api/v1/tasks/submissions/', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const submissions = await response.json()
    return submissions.find((item: { task: { title: string } }) => (
      item.task.title === title
    ))?.id as string | undefined
  }, taskTitle)
  expect(submissionId).toBeTruthy()

  await adminPage.goto(`/admin/tasks/submissions/${submissionId}`)
  await expect(adminPage.getByText('Task Submission')).toBeVisible()
  await adminPage.getByRole('button', { name: 'Approve & complete' }).click()
  await adminPage.getByRole('button', { name: 'Approve Task Submission' }).click()
  await expect(adminPage.getByText('Approved', { exact: true })).toBeVisible({ timeout: 30_000 })
  await adminContext.close()

  await page.reload()
  await expect(page.getByText('Approved', { exact: true })).toBeVisible({ timeout: 30_000 })
})
