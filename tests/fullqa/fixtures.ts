import { test as base, expect, type Page } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
export const API = 'http://127.0.0.1:8010/api'
type Fixture = { key: string; password: string; admin: {id:string;email:string}; member: {id:string;email:string}; other: {id:string;email:string}; package: string; tenure: string; payment: string; ticket: string; withdrawal:string;wallet:string;transaction:string;points:string;point_transaction:string;resource:string;partner:string;task:string;submission:string }
export const test = base.extend<{ data: Fixture }>({
  data: async ({}, use) => {
    const key = randomUUID().slice(0, 8)
    execFileSync('powershell.exe', ['-NoProfile', '-Command', `& '${path.resolve('../cash4us-Django/scripts/fullqa.ps1').replaceAll("'", "''")}' seed_fullqa -ExtraArgs @('--key', '${key}')`], { timeout: 60_000 })
    const data = JSON.parse(readFileSync(path.resolve(`../qa-artifacts/fixture-${key}.json`), 'utf8'))
    await use(data)
  },
})
test.beforeEach(async ({page}, info) => {
  const responses: object[] = []
  const errors: string[] = []
  await page.context().route('**/*', route => {
    const url = new URL(route.request().url())
    return ['127.0.0.1', 'localhost'].includes(url.hostname) || ['data:', 'blob:'].includes(url.protocol) ? route.continue() : route.abort()
  })
  page.on('response', r => { if (r.url().includes('/api/')) responses.push({method:r.request().method(),url:r.url(),status:r.status()}) })
  page.on('pageerror', e => errors.push(e.message))
  page.on('dialog', d => d.accept())
  ;(page as any).qaEvidence = { responses, errors }
})
test.afterEach(async ({page}, info) => {
  const evidence = (page as any).qaEvidence
  await info.attach('API and runtime evidence', {body:JSON.stringify(evidence,null,2),contentType:'application/json'})
  expect(evidence.errors).toEqual([])
  expect(evidence.responses.filter((r:any)=>r.status>=500)).toEqual([])
})
export async function login(page:Page, data:Fixture, role:'admin'|'member'='admin') {
  await page.addInitScript((auth:any)=>{
    localStorage.setItem('cash4us_access_token',auth.access)
    localStorage.setItem('cash4us_refresh_token',auth.refresh)
  },data[role])
  await page.goto(role==='admin'?'/admin':'/dashboard')
  await expect(page).toHaveURL(role==='admin'?/\/admin$/:/\/dashboard$/, {timeout:45_000})
  await expect(page.locator('main')).toBeVisible()
}
export async function loginThroughUI(page:Page, data:Fixture, role:'admin'|'member'='admin') {
  await page.goto('/login')
  await page.locator('#email').fill(data[role].email)
  await page.locator('#password').fill(data.password)
  await page.getByRole('button',{name:'Sign in',exact:true}).click()
  await expect(page).toHaveURL(role==='admin'?/\/admin$/:/\/dashboard$/, {timeout:45_000})
}
export async function api(page:Page, endpoint:string, method='GET', body?:unknown) {
  return page.evaluate(async ({url,method,body})=>{
    const response=await fetch(url,{method,headers:{Authorization:`Bearer ${localStorage.getItem('cash4us_access_token')}`,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)})
    return {status:response.status,body:await response.json().catch(()=>null)}
  }, {url:API+endpoint,method,body})
}
export async function field(page:Page, label:string, value:string) {
  const el=page.locator('label').filter({hasText:new RegExp(`^${label}$`)}).last()
  await el.locator('..').locator('input,textarea,select').first().fill(value)
}
export {expect}
