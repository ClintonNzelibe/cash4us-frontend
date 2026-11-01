import { defineConfig } from '@playwright/test'
const run = process.env.QA_RUN || new Date().toISOString().replace(/[:.]/g, '-')
process.env.QA_RUN = run
const output = `../qa-artifacts/runs/${run}`
export default defineConfig({
  testDir: './tests/fullqa', timeout: 180_000, expect: { timeout: 30_000 },
  workers: 1, fullyParallel: false, retries: 0,
  outputDir: `${output}/browser`,
  reporter: [['list'], ['json', { outputFile: `${output}/results.json` }], ['html', { outputFolder: `${output}/html`, open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:5180', channel: 'chrome', headless: false, actionTimeout:20_000,
    viewport: { width: 1440, height: 1000 }, launchOptions: { slowMo: 100 },
    screenshot: 'on', trace: 'on' },
})
