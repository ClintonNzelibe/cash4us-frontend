import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/responsive', workers: 1, retries: 0, timeout: 240_000,
  expect: { timeout: 10_000 },
  outputDir: '../qa-artifacts/responsive-browser', reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5184', channel: 'chrome', headless: true,
    actionTimeout: 10_000, navigationTimeout: 20_000,
    trace: 'off', screenshot: 'only-on-failure' },
})
