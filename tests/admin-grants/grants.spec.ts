import { test as base, expect, type Page } from '@playwright/test'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

const execute = promisify(execFile)
const API = 'http://127.0.0.1:8014/api'
type Fixture = { admin_email: string; admin_password: string; member_email: string; member_password: string;
  staff_email: string; member_id: string; package_id: string; tenure_id: string; package_name: string; slug: string }
const setup = `
import os,sys,json,secrets
from pathlib import Path
import django;django.setup()
from apps.common.qa_safety import validate_fixture_target
assert validate_fixture_target(confirmed=True)
from django.core.management import call_command
from io import StringIO
out=StringIO();call_command('seed_fullqa',key=sys.argv[1],confirm_isolated=True,stdout=out)
seed=json.loads(Path(out.getvalue().strip()).read_text())
from apps.users.models import User
from django.contrib.auth.models import Permission
admin=User.objects.get(pk=seed['admin']['id'])
admin.user_permissions.add(Permission.objects.get(codename='grant_package',content_type__app_label='packages'))
admin.user_permissions.add(Permission.objects.get(codename='retire_test_grant',content_type__app_label='packages'))
password=secrets.token_urlsafe(24)
member=User.objects.create_user(email=sys.argv[1]+'@cash4us.local',username=sys.argv[1],password=password,referral_code=secrets.token_hex(4))
staff=User.objects.create_user(email=sys.argv[1]+'-staff@cash4us.local',username=sys.argv[1]+'-staff',password=password,is_staff=True,referral_code=secrets.token_hex(4))
from apps.packages.models import Package
package=Package.objects.get(pk=seed['package'])
fixture=dict(admin_email=admin.email,admin_password=seed['password'],member_email=member.email,member_password=password,staff_email=staff.email,member_id=str(member.pk),package_id=str(package.pk),tenure_id=seed['tenure'],package_name=package.name,slug=package.slug)
target=Path(out.getvalue().strip()).with_name('grant-browser-'+sys.argv[1]+'.json');target.write_text(json.dumps(fixture));print(target)
`
const test = base.extend<{ data: Fixture }>({
  data: async ({ browserName }, provide) => {
    void browserName
    if (!/^cash4us_qa_[a-z0-9_]{1,48}$/.test(process.env.FULLQA_SCHEMA || '')) throw new Error('Explicit isolated FULLQA_SCHEMA required')
    const backend = path.resolve('../cash4us-django')
    const result = await execute(path.join(backend,'venv/Scripts/python.exe'), ['-B','-c',setup,'grant-'+randomUUID().slice(0,8)], {
      cwd: backend, windowsHide: true, timeout: 45_000,
      env: {...process.env,DJANGO_SETTINGS_MODULE:'config.settings.fullqa',FULLQA_FIXTURES_ENABLED:'1'},
    })
    await provide(JSON.parse(readFileSync(result.stdout.trim(),'utf8')))
  },
})
test.beforeEach(async ({ context }) => {
  await context.route('**/*', route => {
    const url = new URL(route.request().url())
    return ['127.0.0.1','localhost'].includes(url.hostname) || ['data:','blob:'].includes(url.protocol) ? route.continue() : route.abort()
  })
})
async function login(page: Page, data: Fixture, role: 'admin'|'member'|'staff' = 'admin') {
  await page.goto('/login')
  await page.locator('#email').fill(data[`${role}_email`])
  await page.locator('#password').fill(role === 'admin' ? data.admin_password : data.member_password)
  await page.getByRole('button',{name:'Sign in',exact:true}).click()
  await expect(page).toHaveURL(role === 'member' ? /\/dashboard$/ : /\/admin$/)
}
async function review(page: Page, data: Fixture, testRun?: string) {
  await page.goto(`/admin/members/${data.member_id}`)
  await page.getByRole('button',{name:'Grant package',exact:true}).click()
  await page.getByLabel('Package',{exact:true}).selectOption(data.package_id)
  await page.getByLabel('Tenure',{exact:true}).selectOption(data.tenure_id)
  await page.getByLabel('Purchase / case reference',{exact:true}).fill('CASE-'+data.member_id)
  await page.getByLabel('Reason',{exact:true}).fill('Authorized isolated grant test')
  if (testRun) await page.getByLabel('Test run',{exact:true}).fill(testRun)
  await page.getByRole('button',{name:'Review grant',exact:true}).click()
  await expect(page.getByText('Review administrative grant',{exact:true})).toBeVisible()
}
async function api(page: Page, route: string, body?: object) {
  return page.evaluate(async ({route,body,API}) => {
    const response=await fetch(API+route,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+localStorage.getItem('cash4us_access_token'),'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined})
    return {status:response.status,body:await response.json()}
  },{route,body,API})
}

async function localOnly(source: string, ...args: string[]) {
  const backend=path.resolve('../cash4us-django')
  await execute(path.join(backend,'venv/Scripts/python.exe'),['-B','-c',
    `import django;django.setup()\nfrom apps.common.qa_safety import validate_fixture_target\nassert validate_fixture_target(confirmed=True)\n`+source,...args],{
    cwd:backend,windowsHide:true,timeout:45_000,
    env:{...process.env,DJANGO_SETTINGS_MODULE:'config.settings.fullqa',FULLQA_FIXTURES_ENABLED:'1'},
  })
}

test('review, confirm, immutable history and member ACTIVE ADMIN_GRANT without a payment', async ({ page, data, browser }) => {
  await login(page,data); await review(page,data)
  await expect(page.getByText(/No referral commissions or referral points are issued/)).toBeVisible()
  const response=page.waitForResponse(r=>r.url()===API+'/admin/packages/grants/'&&r.request().method()==='POST')
  await page.getByRole('button',{name:'Confirm package grant',exact:true}).click()
  expect((await response).status()).toBe(201)
  await expect(page.getByRole('status')).toContainText('Package granted successfully')
  await page.reload()
  await expect(page.getByText('Authorized isolated grant test',{exact:true})).toBeVisible()
  const memberContext=await browser.newContext(); const member=await memberContext.newPage()
  await memberContext.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort())
  await login(member,data,'member'); await member.goto('/packages/my')
  await expect(member.getByText('ACTIVE',{exact:true}).first()).toBeVisible()
  await expect(member.getByText('ADMIN_GRANT · Administrative activation',{exact:true})).toBeVisible()
  const payments=await api(member,'/payments/'); expect(payments.body).toEqual([])
  await memberContext.close()
})

test('designated test grant retires permanently while member and audit history remain visible', async ({ page, data, browser }) => {
  await login(page,data); await review(page,data,'CLIENTQA-'+data.member_id.slice(0,8))
  const created=page.waitForResponse(r=>r.url()===API+'/admin/packages/grants/'&&r.request().method()==='POST')
  await page.getByRole('button',{name:'Confirm package grant',exact:true}).click()
  const grant=(await (await created).json()).grant
  await page.getByRole('button',{name:'Retire test grant',exact:true}).click()
  await page.getByLabel('Retirement reason',{exact:true}).fill('Client testing completed')
  await page.getByRole('button',{name:'Confirm retirement',exact:true}).click()
  await expect(page.getByRole('status')).toContainText('Test grant retired')
  await page.reload()
  await expect(page.getByText('ADMIN_GRANT · RETIRED',{exact:true})).toBeVisible()
  await expect(page.getByRole('button',{name:'Retire test grant',exact:true})).toHaveCount(0)
  expect((await api(page,`/admin/packages/grants/${grant.id}/retire/`,{reason:'Client testing completed'})).status).toBe(200)
  const history=await api(page,`/admin/packages/grants/?member=${data.member_id}`)
  expect(history.body.results).toHaveLength(1)
  expect(history.body.results[0].retired_at).toBeTruthy()
  const memberContext=await browser.newContext(); const member=await memberContext.newPage()
  await memberContext.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort())
  await login(member,data,'member'); await member.goto('/packages/my')
  await expect(member.getByText('No active package',{exact:true})).toBeVisible()
  await expect(member.getByText(/RETIRED · Test grant:/)).toBeVisible()
  await memberContext.close()
})

test('mandatory reason and reference prevent an incomplete review', async ({ page, data }) => {
  await login(page,data); await page.goto(`/admin/members/${data.member_id}`)
  await page.getByRole('button',{name:'Grant package',exact:true}).click()
  await page.getByLabel('Package',{exact:true}).selectOption(data.package_id)
  await page.getByLabel('Tenure',{exact:true}).selectOption(data.tenure_id)
  await page.getByLabel('Purchase / case reference',{exact:true}).fill('CASE-'+data.member_id)
  await page.getByLabel('Reason',{exact:true}).fill('   ')
  await page.getByRole('button',{name:'Review grant',exact:true}).click()
  await expect(page.getByRole('alert')).toContainText('provide a reason')
  await expect(page.getByRole('button',{name:'Confirm package grant',exact:true})).toHaveCount(0)
})

test('staff without grant permission cannot use the interface or endpoint', async ({ page, data }) => {
  await login(page,data,'staff'); await page.goto(`/admin/members/${data.member_id}`)
  await expect(page.getByRole('button',{name:'Grant package',exact:true})).toBeDisabled()
  const response=await api(page,'/admin/packages/grants/',{member:data.member_id,package:data.package_id,tenure:data.tenure_id,reason:'Denied',purchase_reference:'CASE-X',idempotency_key:randomUUID()})
  expect(response.status).toBe(403)
})

test('ordinary member is denied admin grant access', async ({ page, data }) => {
  await login(page,data,'member')
  expect((await api(page,'/admin/packages/grants/',{member:data.member_id})).status).toBe(403)
  await page.goto(`/admin/members/${data.member_id}`)
  await expect(page).toHaveURL(/\/dashboard$/)
})

test('uncertain response retries the same idempotency key and creates no second cycle', async ({ page, data }) => {
  await login(page,data); await review(page,data)
  const payloads: string[]=[]
  await page.route('**/api/admin/packages/grants/',async route=>{
    if(route.request().method()!=='POST')return route.continue()
    payloads.push(route.request().postData() || '')
    if(payloads.length===1){await route.fetch();return route.fulfill({status:502,contentType:'application/json',body:JSON.stringify({detail:'Synthetic lost response; retry safely.'})})}
    return route.continue()
  })
  await page.getByRole('button',{name:'Confirm package grant',exact:true}).click()
  await expect(page.getByRole('alert')).toContainText('Synthetic lost response')
  await page.getByRole('button',{name:'Confirm package grant',exact:true}).click()
  await expect(page.getByRole('status')).toContainText('No duplicate activation')
  expect(payloads).toHaveLength(2);expect(payloads[0]).toBe(payloads[1])
})

test('active-cycle conflict is shown without hiding existing grant history', async ({ page, data }) => {
  await login(page,data)
  const response=await api(page,'/admin/packages/grants/',{member:data.member_id,package:data.package_id,tenure:data.tenure_id,reason:'First audited grant',purchase_reference:'FIRST-'+data.member_id,idempotency_key:randomUUID()})
  expect(response.status).toBe(201)
  await review(page,data)
  await page.getByRole('button',{name:'Confirm package grant',exact:true}).click()
  await expect(page.getByRole('alert')).toContainText('already has an active cycle')
  await expect(page.getByText('First audited grant',{exact:true})).toBeVisible()
})

test('payment summary retains tenure through detail load, refresh and manual approval', async ({ page, data, browser }) => {
  await login(page,data,'member')
  const created=await api(page,'/payments/submit/',{package:data.package_id,tenure:data.tenure_id,payment_network:'BEP20',installment_number:1})
  expect(created.status).toBe(201)
  await page.goto(`/packages/${data.slug}/payment`)
  await expect(page.getByText('30 days',{exact:true})).toBeVisible()
  await page.getByRole('button',{name:'Refresh status',exact:true}).click()
  await expect(page.getByText('30 days',{exact:true})).toBeVisible()
  const adminContext=await browser.newContext();const admin=await adminContext.newPage()
  await login(admin,data)
  const approved=await api(admin,`/admin/payments/${created.body.id}/approve/`,{remarks:'Synthetic manual approval; no on-chain verification'})
  expect(approved.status).toBe(200)
  await page.getByRole('button',{name:'Refresh status',exact:true}).click()
  await expect(page.getByText('30 days',{exact:true})).toBeVisible()
  await expect(page.getByText(/approved by an administrator/)).toBeVisible()
  await expect(page.getByRole('button',{name:'Copy address',exact:true})).toHaveCount(0)
  await adminContext.close()
})

test('expired payment keeps its pending history and hides send and copy instructions', async ({page,data}) => {
  await login(page,data,'member')
  const created=await api(page,'/payments/submit/',{package:data.package_id,tenure:data.tenure_id,payment_network:'BEP20',installment_number:1})
  expect(created.status).toBe(201)
  await localOnly(`
import sys
from datetime import timedelta
from django.utils import timezone
from apps.payments.models import Payment
Payment.objects.filter(pk=sys.argv[1]).update(verification_expires_at=timezone.now()-timedelta(seconds=1))
`,created.body.id)
  await page.goto(`/packages/${data.slug}/payment`)
  await expect(page.getByRole('alert')).toContainText('Do not send funds')
  await expect(page.getByRole('button',{name:'Copy address',exact:true})).toHaveCount(0)
  await expect(page.getByRole('heading',{name:'Send USDT on BEP20',exact:true})).toHaveCount(0)
  const payment=await api(page,`/payments/${created.body.id}/`)
  expect(payment.body.status).toBe('PENDING')
  expect(payment.body.instruction_state).toBe('EXPIRED_REVIEW_REQUIRED')
  expect(payment.body.verified_at).toBeNull()
  expect((await api(page,'/packages/my/')).body).toEqual([])
})

test('paid legacy membership stays active with normal tasks and without inferred snapshots', async ({page,data}) => {
  await localOnly(`
import sys,uuid
from datetime import timedelta
from django.utils import timezone
from apps.users.models import User
from apps.packages.models import Package,Tenure,MemberCycle
from apps.payments.models import Payment
user=User.objects.get(pk=sys.argv[1]);package=Package.objects.get(pk=sys.argv[2]);tenure=Tenure.objects.get(pk=sys.argv[3])
cycle=MemberCycle.objects.create(user=user,package=package,tenure=tenure,started_at=timezone.now()-timedelta(days=1),ends_at=timezone.now()+timedelta(days=29))
Payment.objects.create(user=user,package=package,tenure=tenure,status='APPROVED',payment_network='BEP20',installment_amount=package.payment_amount,approved_at=cycle.started_at-timedelta(seconds=1),transaction_reference='LOCAL-LEGACY-'+uuid.uuid4().hex)
`,data.member_id,data.package_id,data.tenure_id)
  await login(page,data,'member');await page.goto('/packages/my')
  await expect(page.getByText(/Legacy membership: normal daily tasks remain available/)).toBeVisible()
  const packages=await api(page,'/packages/my/')
  expect(packages.body[0].snapshot_status).toBe('HISTORICAL_UNVERIFIED')
  expect(packages.body[0].legacy_normal_tasks_available).toBe(true)
  const tasks=await api(page,'/v1/tasks/')
  expect(tasks.status).toBe(200)
  expect(tasks.body.length).toBeGreaterThan(0)
})
