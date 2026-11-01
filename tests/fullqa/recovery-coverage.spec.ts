import {test,expect,login,loginThroughUI,api,field} from './fixtures'

for (const role of ['admin','member'] as const) test(`mobile ${role} navigation and route layout at 390px`, async({page,data},info)=>{
  await page.setViewportSize({width:390,height:844})
  await login(page,data,role)
  const menu=page.getByRole('button',{name:role==='admin'?'Open admin navigation':'Open navigation',exact:true})
  await menu.click()
  const profile=page.getByRole('link',{name:role==='admin'?'Members':'Profile & Settings',exact:true})
  await expect(profile).toBeVisible()
  await profile.click()
  await expect(page).toHaveURL(role==='admin'?/\/admin\/members$/:/\/profile$/)
  const routes=role==='admin'?['/admin','/admin/members','/admin/packages','/admin/payments','/admin/tasks','/admin/withdrawals','/admin/wallets','/admin/transactions','/admin/referrals','/admin/rewards/points/accounts']:['/dashboard','/profile','/support','/resources','/partners','/community','/notifications','/wallet','/transactions','/referrals','/tasks','/withdrawals']
  for(const route of routes){
    const endpoints:Record<string,string>={'/admin':'/api/admin/dashboard/','/admin/rewards/points/accounts':'/api/admin/rewards/points/','/dashboard':'/api/v1/wallet/','/profile':'/api/users/me/','/support':'/api/v1/support/','/resources':'/api/v1/resources/','/partners':'/api/v1/partners/','/community':'/api/v1/community/member/earnings/','/notifications':'/api/v1/notifications/','/wallet':'/api/v1/wallet/','/transactions':'/api/transactions/','/referrals':'/api/v1/referrals/','/tasks':'/api/v1/tasks/','/withdrawals':'/api/v1/withdrawals/'}
    const endpoint=endpoints[route]??`/api${route}/`
    const loaded=page.waitForResponse(r=>new URL(r.url()).pathname===endpoint&&r.request().method()==='GET',{timeout:60_000})
    await page.goto(route)
    expect((await loaded).status(),route).toBe(200)
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('main')).not.toContainText(/Loading\.\.\./i)
    await expect(page.locator('main')).not.toContainText(/Failed to load|Something went wrong/i)
    const size=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}))
    expect.soft(size.scroll,route+' horizontal document overflow').toBeLessThanOrEqual(size.width+1)
    await info.attach(route.replaceAll('/','_')+'.png',{body:await page.screenshot({fullPage:false}),contentType:'image/png'})
  }
})

test('admin can log in through the actual UI',async({page,data})=>{
  await loginThroughUI(page,data,'admin')
  await expect(page.locator('main')).toContainText(/Dashboard/i)
})

test('anonymous protected routes redirect and invalid login displays an error',async({page,data})=>{
  for(const route of ['/profile','/wallet','/admin','/admin/payments']){
    await page.goto(route)
    await expect(page).toHaveURL(/\/login$/)
  }
  await page.locator('#email').fill(data.member.email)
  await page.locator('#password').fill('IntentionallyWrongSynthetic42!')
  await page.getByRole('button',{name:'Sign in',exact:true}).click()
  await expect(page.locator('main')).toContainText(/invalid|incorrect|no active account|unable/i)
  await expect(page).toHaveURL(/\/login$/)
})

test('member cannot close or reply to support tickets through staff endpoints',async({page,data})=>{
  await login(page,data,'member')
  for(const action of ['reply','close']){
    expect((await api(page,`/v1/support/${data.ticket}/${action}/`,'PATCH',{reply:'Synthetic forbidden reply'})).status).toBe(403)
  }
  const list=await api(page,'/v1/support/')
  const own=(list.body.results??list.body).find((x:any)=>x.id===data.ticket)
  expect(own.status).toBe('OPEN')
})

for(const action of ['confirm','cancel']) test(`revenue with explicit received date can ${action}`,async({page,data})=>{
  await login(page,data)
  await page.goto('/admin/advertising/revenue/create')
  await page.locator('select').first().selectOption('OTHER')
  await page.getByPlaceholder('0.00').fill('25')
  await page.getByPlaceholder('Payment or revenue reference').fill(`Dated revenue ${data.key}`)
  await page.locator('input[type="datetime-local"]').fill('2026-10-31T12:00')
  await page.locator('button[type=submit]').click()
  await expect(page).not.toHaveURL(/\/create$/)
  const id=page.url().split('/').pop()!
  if(action==='confirm') await page.getByRole('button',{name:'Confirm Revenue',exact:true}).click()
  else {
    await page.getByRole('button',{name:'Cancel Revenue',exact:true}).click()
    await page.getByPlaceholder('Reason for cancellation').fill('Synthetic cancellation')
    await page.getByRole('button',{name:'Confirm Cancellation',exact:true}).click()
  }
  await expect.poll(async()=>(await api(page,`/admin/advertising/revenue/${id}/`)).body.status).toBe(action==='confirm'?'CONFIRMED':'CANCELLED')
  await page.reload()
  await expect(page.getByText(action==='confirm'?'Confirmed':'Cancelled',{exact:true})).toBeVisible()
})

test('notifications and support remain isolated between synthetic members',async({page,data})=>{
  await login(page,data,'member')
  const response=await api(page,'/v1/notifications/')
  const notices=response.body.results??response.body
  expect(notices.length).toBe(2)
  const foreignHeaders={Authorization:`Bearer ${(data.other as any).access}`}
  const attempt=await page.request.patch(`http://127.0.0.1:8010/api/v1/notifications/${notices[0].id}/read/`,{headers:foreignHeaders})
  expect(attempt.status()).toBe(404)
  const otherList=await page.request.get('http://127.0.0.1:8010/api/v1/support/',{headers:foreignHeaders})
  expect(otherList.status()).toBe(200)
  const tickets=await otherList.json()
  expect(tickets.results??tickets).toEqual([])
  expect((await api(page,'/v1/notifications/unread-count/')).body.unread_count).toBe(2)
})

test('profile updates persist after reload and cancelling edits does not write',async({page,data})=>{
  await login(page,data,'member')
  await page.goto('/profile')
  await page.getByRole('button',{name:'Edit Profile',exact:true}).click()
  await field(page,'First Name',`Saved${data.key}`)
  const saved=page.waitForResponse(r=>r.url().includes('/api/users/')&&['PATCH','PUT'].includes(r.request().method()))
  await page.getByRole('button',{name:'Save Changes',exact:true}).click()
  expect((await saved).status()).toBe(200)
  await page.reload()
  await expect(page.getByText(`Saved${data.key}`,{exact:true})).toBeVisible()
  expect((await api(page,'/users/me/')).body.first_name).toBe(`Saved${data.key}`)
  await page.getByRole('button',{name:'Edit Profile',exact:true}).click()
  await field(page,'First Name','Cancelled synthetic edit')
  await page.getByRole('button',{name:'Cancel',exact:true}).click()
  expect((await api(page,'/users/me/')).body.first_name).toBe(`Saved${data.key}`)
})

test('audit detail renders a newly persisted synthetic action',async({page,data})=>{
  await login(page,data)
  const created=await api(page,'/admin/community/create/','POST',{name:`Audit recovery ${data.key}`})
  expect(created.status).toBe(201)
  const logs=await api(page,`/admin/audit-logs/?search=${data.key}`)
  const item=(logs.body.results??logs.body).find((x:any)=>x.resource_id===created.body.id)
  expect(item).toBeTruthy()
  await page.goto(`/admin/audit/${item.id}`)
  await expect(page.locator('main')).toContainText(`Audit recovery ${data.key}`)
})
