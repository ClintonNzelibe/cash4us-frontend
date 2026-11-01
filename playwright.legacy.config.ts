import {defineConfig} from '@playwright/test'
import base from './playwright.fullqa.config'
export default defineConfig({...base,testDir:'./tests',testMatch:['local-visible-promotional-fixtures.spec.ts','local-visible-promotional-edge-fixtures.spec.ts','local-visible-withdrawal-restriction.spec.ts','local-visible-cycle-readiness.spec.ts','financial-legacy/*.spec.ts']})
