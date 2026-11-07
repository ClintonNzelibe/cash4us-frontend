import { test as base, expect, type Page } from '@playwright/test'
import { readFileSync, writeFileSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { randomUUID } from 'node:crypto'
import path from 'node:path'

const execute = promisify(execFile)
type Actor = { access: string; refresh: string }
type Fixture = Record<string, string> & { admin: Actor; member: Actor }
const prepare = `
import os,sys,json
from pathlib import Path
import django;django.setup()
from apps.common.qa_safety import validate_fixture_target
assert validate_fixture_target(confirmed=True)
from django.conf import settings
assert settings.DATABASES['default']['HOST']=='127.0.0.1'
assert str(settings.DATABASES['default']['PORT'])=='55432'
from django.core.management import call_command
from io import StringIO
out=StringIO();call_command('seed_fullqa',key=sys.argv[1],confirm_isolated=True,stdout=out)
p=Path(out.getvalue().strip());d=json.loads(p.read_text())
from apps.packages.models import Package
from apps.users.models import User
from django.contrib.auth.models import Permission
admin=User.objects.get(pk=d['admin']['id']);member=User.objects.get(pk=d['member']['id'])
admin.user_permissions.add(*Permission.objects.filter(codename__in=['grant_package','retire_test_grant']))
d['slug']=Package.objects.get(pk=d['package']).slug
d['member_id']=str(member.pk)
from apps.advertising.models import Advertiser,AdvertisingCampaign,AdvertisingRevenue
a=Advertiser.objects.create(name='Responsive synthetic advertiser '+sys.argv[1])
c=AdvertisingCampaign.objects.create(advertiser=a,title='Responsive synthetic campaign')
r=AdvertisingRevenue.objects.create(campaign=c,source='CAMPAIGN',amount='10')
from apps.community.models import CommunityPool
pool=CommunityPool.objects.create(name='Responsive synthetic pool')
from apps.rewards.models import Award,UserAward
award=Award.objects.create(name='Responsive synthetic award')
ua=UserAward.objects.create(user=member,award=award,awarded_by=admin)
from apps.notifications.models import Notification
from apps.admin_api.models import AdminActionLog
audit=AdminActionLog.objects.create(admin=admin,action='RESPONSIVE_QA',description='Synthetic local viewport audit')
for name,value in [('advertiser',a.pk),('campaign',c.pk),('revenue',r.pk),('pool',pool.pk),('award',award.pk),('user_award',ua.pk),('notification',Notification.objects.filter(user=member).first().pk),('audit',audit.pk)]:d[name]=str(value)
p.write_text(json.dumps(d));print(p)
`
const test = base.extend<object, { fixture: Fixture }>({
  fixture: [async ({ browserName }, use) => {
    void browserName
    if (!/^cash4us_qa_[a-z0-9_]{1,48}$/.test(process.env.FULLQA_SCHEMA || '')) throw Error('Explicit isolated FULLQA_SCHEMA required')
    const backend = path.resolve('../cash4us-django')
    const result = await execute(path.join(backend,'venv/Scripts/python.exe'), ['-B','-c',prepare,'responsive-'+randomUUID().slice(0,8)], {
      cwd: backend, windowsHide: true, timeout: 45_000,
      env: {...process.env,DJANGO_SETTINGS_MODULE:'config.settings.fullqa',FULLQA_FIXTURES_ENABLED:'1'},
    })
    await use(JSON.parse(readFileSync(result.stdout.trim(),'utf8')))
  }, { scope: 'worker' }],
})

const routes = [...readFileSync('src/routes/AppRouter.tsx','utf8').matchAll(/path="([^"]+)"/g)]
  .map(match=>match[1]).filter(route=>route!=='*')
const ids: Record<string,string> = {
  '/admin/members/':'member_id', '/admin/packages/':'package', '/admin/payments/':'payment',
  '/admin/withdrawals/':'withdrawal', '/admin/tasks/submissions/':'submission', '/admin/tasks/':'task',
  '/admin/wallets/':'wallet','/admin/transactions/':'transaction','/admin/referrals/':'referral',
  '/admin/rewards/points/accounts/':'points','/admin/rewards/points/transactions/':'point_transaction',
  '/admin/rewards/awards/':'award','/admin/rewards/user-awards/':'user_award',
  '/admin/advertising/advertisers/':'advertiser','/admin/advertising/campaigns/':'campaign',
  '/admin/advertising/revenue/':'revenue','/admin/community/pools/':'pool',
  '/admin/support/tickets/':'ticket','/admin/resources/':'resource','/admin/partners/':'partner',
  '/admin/notifications/':'notification','/admin/audit/':'audit',
}
function resolveRoute(route: string, fixture: Fixture) {
  if (route.includes(':slug')) return route.replace(':slug',fixture.slug)
  if (!route.includes(':id')) return route
  const key=Object.keys(ids).sort((a,b)=>b.length-a.length).find(prefix=>route.startsWith(prefix))
  if (!key || !fixture[ids[key]]) throw Error('Unmapped route '+route)
  return route.replace(':id',fixture[ids[key]])
}
async function authenticate(page: Page, fixture: Fixture) {
  await page.addInitScript(({admin,member})=>{
    if (['/','/login','/register'].includes(location.pathname)) {
      localStorage.removeItem('cash4us_access_token')
      localStorage.removeItem('cash4us_refresh_token')
      return
    }
    const actor=location.pathname.startsWith('/admin') ? admin : member
    localStorage.setItem('cash4us_access_token',actor.access)
    localStorage.setItem('cash4us_refresh_token',actor.refresh)
  },{admin:fixture.admin,member:fixture.member})
}
test.beforeEach(async ({context})=>{
  await context.route('**/*',route=>{
    const url=new URL(route.request().url())
    return ['127.0.0.1','localhost'].includes(url.hostname) || ['data:','blob:'].includes(url.protocol) ? route.continue() : route.abort()
  })
})
for (const width of [320,375,768,1024,1440]) {
  test(`all routes fit ${width}px`, async ({page,fixture}, info)=>{
    await page.setViewportSize({width,height:900})
    await authenticate(page,fixture)
    const failures: object[]=[]
    const errors: string[]=[]
    page.on('pageerror',error=>errors.push(error.message))
    for (const route of routes) {
      if (routes.indexOf(route)%10===0) console.log(`Viewport ${width}: route ${routes.indexOf(route)+1}/${routes.length}`)
      const target=resolveRoute(route,fixture)
      await page.goto(target)
      await page.waitForLoadState('networkidle')
      const overflow=await page.evaluate(()=>{
        const viewport=document.documentElement.clientWidth
        return {page:document.documentElement.scrollWidth,viewport,elements:[...document.querySelectorAll('main *,form *,header *')].filter(el=>{
          const box=el.getBoundingClientRect()
          if (box.width===0 || box.right<=viewport+1 || box.left<0) return false
          for(let p=el.parentElement;p;p=p.parentElement)if(['auto','scroll','hidden'].includes(getComputedStyle(p).overflowX))return false
          return true
        }).slice(0,8).map(el=>({tag:el.tagName,class:el.className,text:el.textContent?.slice(0,70)}))}
      })
      if (overflow.page>width+1 || overflow.elements.length || errors.length) {
        failures.push({route,...overflow,errors:[...errors]})
        errors.length=0
      }
      if (['/dashboard','/admin/members','/login'].includes(route)) {
        await page.screenshot({path:info.outputPath(route.replaceAll('/','_')+'-'+width+'.png')})
      }
      await expect(page.locator('body')).not.toBeEmpty()
    }
    writeFileSync(info.outputPath('route-audit.json'),JSON.stringify({width,routes:routes.length,failures},null,2))
    expect(failures,JSON.stringify(failures,null,2)).toEqual([])
  })
}

for (const width of [320,375,768,1024,1440]) {
  test(`navigation and package modal work at ${width}px`, async ({page,fixture})=>{
    await page.setViewportSize({width,height:568})
    await authenticate(page,fixture)
    for (const [route,label,openLabel] of [['/dashboard','Member navigation','Open navigation'],['/admin','Admin navigation','Open admin navigation']]) {
      await page.goto(route)
      await page.waitForLoadState('networkidle')
      const drawer=page.getByLabel(label,{exact:true})
      if (width<1024) {
        await expect(drawer).toHaveJSProperty('inert',true)
        const trigger=page.getByRole('button',{name:openLabel,exact:true})
        await trigger.click()
        await expect(drawer).toHaveJSProperty('inert',false)
        await expect.poll(()=>page.evaluate(()=>document.body.style.overflow)).toBe('hidden')
        await expect.poll(()=>drawer.evaluate(el=>el.contains(document.activeElement))).toBe(true)
        await page.keyboard.press('Shift+Tab')
        await expect.poll(()=>drawer.evaluate(el=>el.contains(document.activeElement))).toBe(true)
        await page.keyboard.press('Escape')
        await expect(drawer).toHaveJSProperty('inert',true)
        await expect(trigger).toBeFocused()
        await trigger.click()
        await drawer.getByRole('link',{name:'Packages',exact:true}).click()
        await expect(drawer).toHaveJSProperty('inert',true)
      } else {
        await expect(drawer).toHaveJSProperty('inert',false)
        expect((await drawer.boundingBox())?.width).toBe(route==='/admin'?288:256)
      }
    }
    await page.goto('/admin/packages/'+fixture.package)
    await page.getByRole('button',{name:'Edit package',exact:true}).click()
    const modal=page.getByRole('dialog')
    await expect(modal).toBeVisible()
    const box=await modal.boundingBox()
    expect(box?.x).toBeGreaterThanOrEqual(0)
    expect((box?.x||0)+(box?.width||0)).toBeLessThanOrEqual(width)
    expect((box?.y||0)+(box?.height||0)).toBeLessThanOrEqual(568)
    await modal.getByRole('button',{name:'Close',exact:true}).click()
    await expect(modal).not.toBeVisible()
    await page.getByRole('button',{name:'Add Tenure',exact:true}).click()
    await expect(page.getByRole('dialog',{name:'Add Tenure',exact:true})).toBeVisible()
    await page.getByRole('button',{name:'Close tenure modal'}).click()
    for (const [route,button] of [['/admin/payments/'+fixture.payment,'Reject'],['/wallet','Add Wallet Address'],['/support','New Ticket']]) {
      await page.goto(route)
      await page.getByRole('button',{name:new RegExp('^'+button)}).click()
      const panel=page.getByRole('dialog')
      await expect(panel).toBeVisible()
      const bounds=await panel.boundingBox()
      expect(bounds?.x).toBeGreaterThanOrEqual(0)
      expect((bounds?.x||0)+(bounds?.width||0)).toBeLessThanOrEqual(width)
      expect(bounds?.y).toBeGreaterThanOrEqual(0)
      expect((bounds?.y||0)+(bounds?.height||0)).toBeLessThanOrEqual(568)
      expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
    }
    await page.goto('/admin/members/'+fixture.member_id)
    await page.getByRole('button',{name:'Grant package',exact:true}).click()
    await page.getByLabel('Package',{exact:true}).selectOption(fixture.package)
    await page.getByLabel('Tenure',{exact:true}).selectOption(fixture.tenure)
    await page.getByLabel('Purchase / case reference',{exact:true}).fill('RESPONSIVE-'+ 'X'.repeat(70))
    await page.getByLabel('Reason',{exact:true}).fill('Synthetic layout review only. No activation is submitted. '.repeat(5))
    await page.getByRole('button',{name:'Review grant',exact:true}).click()
    await expect(page.getByRole('button',{name:'Confirm package grant',exact:true})).toBeVisible()
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
  })
}
