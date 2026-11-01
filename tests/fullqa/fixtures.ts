import { test as base, expect, type Page } from '@playwright/test'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
const execute = promisify(execFile)
import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
export const API = 'http://127.0.0.1:8010/api'
type Fixture = { key: string; password: string; admin: {id:string;email:string}; member: {id:string;email:string}; other: {id:string;email:string}; package: string; tenure: string; payment: string; ticket: string; withdrawal:string;wallet:string;transaction:string;points:string;point_transaction:string;resource:string;partner:string;task:string;submission:string }
export const test = base.extend<{ data: Fixture; qaEvidence: void }>({
  qaEvidence: [async ({page}, use, info) => {
    const responses: {method:string;url:string;status:number}[] = []
    const errors: string[] = []
    const dialogs: string[] = []
    const interruptions: number[] = []
    let lastTick=Date.now()
    const heartbeat=setInterval(()=>{const now=Date.now();if(now-lastTick>30_000)interruptions.push(now-lastTick);lastTick=now},1000)
    await page.context().route('**/*', route => {
      const url = new URL(route.request().url())
      return ['127.0.0.1', 'localhost'].includes(url.hostname) || ['data:', 'blob:'].includes(url.protocol) ? route.continue() : route.abort()
    })
    page.on('response', r => { if (r.url().includes('/api/')) responses.push({method:r.request().method(),url:r.url(),status:r.status()}) })
    page.on('pageerror', e => errors.push(e.message))
    page.on('dialog', async d => { dialogs.push(d.type()+': '+d.message()); await d.accept() })
    await use()
    clearInterval(heartbeat)
    await info.attach('API and runtime evidence', {body:JSON.stringify({responses,errors,dialogs,interruptions},null,2),contentType:'application/json'})
    expect(interruptions,'Environment paused during the workflow').toEqual([])
    expect(errors).toEqual([])
    expect(responses.filter(r=>r.status>=500)).toEqual([])
  }, {auto:true}],
  data: async ({}, use) => {
    const key = randomUUID().slice(0, 8)
    const backend=path.resolve('../cash4us-django')
    const started=Date.now()
    await execute(path.join(backend,'venv/Scripts/python.exe'), ['manage.py','seed_fullqa','--confirm-isolated','--key',key,'--settings=config.settings.fullqa'], {cwd:backend,timeout:45_000,windowsHide:true})
    if(Date.now()-started>45_000) throw new Error('Fixture preparation exceeded its wall-clock limit; possible environment interruption.')
    const data = JSON.parse(readFileSync(path.resolve(`../qa-artifacts/fixture-${key}.json`), 'utf8'))
    await use(data)
  },
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
