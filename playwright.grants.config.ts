import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/admin-grants', timeout: 90_000, workers: 1, retries: 0,
  expect: { timeout: 20_000 },
  outputDir: '../qa-artifacts/grant-browser', reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5184', channel: 'chrome', headless: true,
    trace: 'off', screenshot: 'only-on-failure' },
})
