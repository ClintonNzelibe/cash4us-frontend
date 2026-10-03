import { defineConfig } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL
  || 'http://127.0.0.1:5173'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL,
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
})
