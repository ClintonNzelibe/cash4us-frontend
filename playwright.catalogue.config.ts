import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/client-catalogue', workers: 1, retries: 0,
  reporter: 'list', outputDir: '../qa-artifacts/client-catalogue',
  use: { baseURL: 'http://127.0.0.1:5186', channel: 'chrome', headless: true },
})
