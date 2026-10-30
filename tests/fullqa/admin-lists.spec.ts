import {test,expect,login,api} from './fixtures'

const lists = [
 ['payments','payments'],['withdrawals','withdrawals'],['wallets','wallets'],['transactions','transactions'],
 ['referrals','referrals'],['rewards/points/accounts','rewards/points'],['rewards/points/transactions','rewards/point-transactions'],
 ['rewards/leaderboard','rewards/leaderboard'],['rewards/awards','rewards/awards'],['rewards/user-awards','rewards/user-awards'],
 ['advertising/advertisers','advertising/advertisers'],['advertising/campaigns','advertising/campaigns'],['advertising/revenue','advertising/revenue'],
 ['community/pools','community'],['support/tickets','support'],['resources','resources'],['partners','partners'],['notifications','notifications'],['audit','audit-logs'],
]
for(const [route,endpoint] of lists) test(`admin ${route}: search and available filters return successful API results`,async({page,data},info)=>{
  await login(page,data)
  await page.goto(`/admin/${route}`)
  await expect(page.locator('main').getByRole('heading').first()).toBeVisible()
  const initial=await api(page,`/admin/${endpoint}/`)
  expect(initial.status).toBe(200)
  const search=page.locator('input[placeholder]').filter({visible:true}).first()
  let actions=0
  if(await search.count()) {
    const marker=`NO_MATCH_${data.key}`
    const response=page.waitForResponse(r=>r.url().includes(`/api/admin/${endpoint}/`)&&r.url().includes(marker))
    await search.fill(marker)
    const filtered=await response
    expect(filtered.status()).toBe(200)
    const payload=await filtered.json()
    expect(payload.results??payload).toEqual([])
    await search.fill('')
    actions++
  }
  const selects=page.locator('select')
  for(let i=0;i<await selects.count();i++) {
    const select=selects.nth(i)
    const options=await select.locator('option').evaluateAll(opts=>opts.map(o=>({value:(o as HTMLOptionElement).value,disabled:(o as HTMLOptionElement).disabled})))
    const current=await select.inputValue()
    const option=options.find(o=>!o.disabled&&o.value!==current)
    if(option) {
      const response=page.waitForResponse(r=>r.url().includes(`/api/admin/${endpoint}/`)&&r.request().method()==='GET'&&Array.from(new URL(r.url()).searchParams.values()).includes(option.value))
      await select.selectOption(option.value)
      expect((await response).status()).toBe(200)
      await select.selectOption(current)
      actions++
    }
  }
  const reset=page.getByRole('button',{name:/Reset|Clear filters/i})
  if(await reset.count()){await reset.first().click();actions++}
  const refresh=page.getByRole('button',{name:'Refresh',exact:true})
  if(await refresh.count()){await refresh.first().click();actions++}
  if(route==='rewards/leaderboard' && actions===0) {
    await expect(page.locator('main')).toContainText(/Leaderboard/i)
    info.annotations.push({type:'coverage',description:'Read-only leaderboard: no filters or actions are implemented.'})
  } else expect(actions).toBeGreaterThan(0)
  await info.attach('filter coverage',{body:JSON.stringify({route,actions}),contentType:'application/json'})
})

test('admin dashboard refresh and populated finance details',async({page,data})=>{
  await login(page,data)
  const refreshed=page.waitForResponse(r=>r.url().includes('/api/admin/dashboard/')&&r.status()===200)
  await page.getByRole('button',{name:'Refresh',exact:true}).click()
  await refreshed
  for(const [route,endpoint,id] of [
    ['withdrawals','withdrawals',data.withdrawal],['wallets','wallets',data.wallet],
    ['transactions','transactions',data.transaction],['rewards/points/accounts','rewards/points',data.points],
    ['rewards/points/transactions','rewards/point-transactions',data.point_transaction],
  ]){
    await page.goto(`/admin/${route}/${id}`)
    const detail=await api(page,`/admin/${endpoint}/${id}/`)
    expect(detail.status).toBe(200)
    expect(JSON.stringify(detail.body)).toContain(id)
    await expect(page.locator('main')).not.toContainText(/not found|Failed to load/i)
  }
})
