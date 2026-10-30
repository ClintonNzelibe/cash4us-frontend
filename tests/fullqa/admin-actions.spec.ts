import {test,expect,login,api} from './fixtures'

for(const action of ['approve','reject']) test(`task submission ${action}, confirmation and persistence`,async({page,data})=>{
  await login(page,data)
  await page.goto(`/admin/tasks/submissions/${data.submission}`)
  await page.getByRole('button',{name:action==='approve'?'Approve & complete':'Reject',exact:true}).click()
  await page.locator('textarea').fill(`Synthetic review ${action}`)
  await page.getByRole('button',{name:'Confirm',exact:true}).click()
  await expect(page.getByRole('button',{name:'Confirm',exact:true})).toHaveCount(0)
  await page.reload()
  const detail=await api(page,`/admin/tasks/submissions/${data.submission}/`)
  expect(detail.status).toBe(200)
  expect(detail.body.status).toBe(action==='approve'?'COMPLETED':'REJECTED')
})

for(const kind of ['resources','partners']) test(`${kind} activate and deactivate persist`,async({page,data})=>{
  await login(page,data)
  const id=kind==='resources'?data.resource:data.partner
  const open=async()=>{
    await page.goto(kind==='partners'?'/admin/partners':`/admin/${kind}/${id}`)
    if(kind==='partners') await page.getByPlaceholder(/search/i).fill(`Fixture Partner ${data.key}`)
  }
  await open()
  await page.getByRole('button',{name:'Deactivate',exact:true}).first().click()
  await page.getByRole('button',{name:'Deactivate',exact:true}).last().click()
  await expect(page.getByRole('button',{name:'Activate',exact:true})).toBeVisible()
  await page.reload()
  if(kind==='partners') await page.getByPlaceholder(/search/i).fill(`Fixture Partner ${data.key}`)
  expect((await api(page,`/admin/${kind}/${id}/`)).body.is_active).toBe(false)
  await page.getByRole('button',{name:'Activate',exact:true}).first().click()
  await page.getByRole('button',{name:'Activate',exact:true}).last().click()
  await expect(page.getByRole('button',{name:'Deactivate',exact:true})).toBeVisible()
  expect((await api(page,`/admin/${kind}/${id}/`)).body.is_active).toBe(true)
})

test('admin API validation rejects invalid payloads without writes',async({page,data})=>{
  await login(page,data)
  for(const endpoint of ['/admin/packages/create/','/admin/tasks/create/','/admin/resources/create/','/admin/partners/create/','/admin/rewards/awards/create/','/admin/advertising/advertisers/create/','/admin/advertising/campaigns/create/','/admin/advertising/revenue/create/','/admin/community/create/','/admin/notifications/send/']) {
    const response=await api(page,endpoint,'POST',{})
    expect(response.status,endpoint+JSON.stringify(response.body)).toBe(400)
    expect(Object.keys(response.body).length).toBeGreaterThan(0)
  }
  expect((await api(page,`/admin/members/${data.member.id}/status/`,'PATCH',{is_active:'invalid'})).status).toBe(400)
})

test('ordinary member cannot access any admin module or mutate admin records',async({page,data})=>{
  await login(page,data,'member')
  for(const endpoint of ['dashboard','members','packages','payments','withdrawals','tasks','wallets','transactions','referrals','rewards/points','rewards/awards','advertising/advertisers','advertising/campaigns','advertising/revenue','community','support','resources','partners','notifications','audit-logs']) {
    expect((await api(page,`/admin/${endpoint}/`)).status,endpoint).toBe(403)
  }
  expect((await api(page,`/admin/members/${data.other.id}/status/`,'PATCH',{is_active:false})).status).toBe(403)
  expect((await api(page,`/admin/payments/${data.payment}/approve/`,'POST',{})).status).toBe(403)
  await page.goto('/admin')
  await expect(page).not.toHaveURL(/\/admin$/)
})
