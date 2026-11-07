import type { Page } from '@playwright/test'
import {test,expect,api} from '../fullqa/fixtures'
const adminEmail=process.env.E2E_LEGACY_ADMIN_EMAIL
const adminPassword=process.env.E2E_LEGACY_ADMIN_PASSWORD
test.beforeEach(()=>{
 if(!adminEmail||!adminPassword) throw new Error('Load synthetic admin credentials from the local fixture manifest.')
})
async function signIn(page:Page,email:string,password:string,isAdmin=false){
 await page.goto('/login'); await page.locator('#email').fill(email); await page.locator('#password').fill(password)
 await page.getByRole('button',{name:'Sign in',exact:true}).click()
 await expect(page).toHaveURL(isAdmin?/\/admin$/:/\/dashboard$/)
}
for(const action of ['approve','reject']) test(`legacy withdrawal ${action}: fee, pending persistence, allocation and duplicate processing`,async({page})=>{
 await signIn(page,'visible-e2e-withdrawal@cash4us.local','VisibleE2E42')
 const before=(await api(page,'/v1/wallet/')).body
 await page.goto('/withdrawals')
 await page.getByRole('button',{name:'Request Withdrawal',exact:true}).click()
 await page.locator('#withdrawal-network').selectOption('BEP20')
 await page.locator('#withdrawal-address').fill('0x'+'1'.repeat(40))
 await page.locator('#withdrawal-amount').fill('20')
 await expect(page.locator('form').getByText('$2.00',{exact:true})).toBeVisible()
 await expect(page.locator('form').getByText('$18.00',{exact:true})).toBeVisible()
 const created=page.waitForResponse(r=>r.url().endsWith('/api/v1/withdrawals/')&&r.request().method()==='POST')
 await page.getByRole('button',{name:'Request Withdrawal',exact:true}).last().click()
 const response=await created;expect(response.status()).toBe(201)
 const withdrawal=(await api(page,'/v1/withdrawals/')).body[0]
 expect(Number(withdrawal.admin_fee)).toBe(2);expect(Number(withdrawal.net_amount)).toBe(18)
 await page.reload()
 await expect(page.getByRole('cell',{name:'PENDING',exact:true})).toBeVisible()
 const held=(await api(page,'/v1/wallet/')).body
 expect(Number(held.pending_balance)).toBe(Number(before.pending_balance)+20)
 expect(Number(held.available_balance)).toBe(Number(before.available_balance)-20)
 await page.getByRole('button',{name:'Logout',exact:true}).click()
 await signIn(page,adminEmail!,adminPassword!,true)
 await page.goto(`/admin/withdrawals/${withdrawal.id}`)
 await page.getByRole('button',{name:action==='approve'?'Approve Withdrawal':'Reject Withdrawal',exact:true}).click()
 await page.locator('textarea').fill('Synthetic legacy '+action)
 await page.getByRole('button',{name:'Confirm',exact:true}).click()
 const expected=action==='approve'?'APPROVED':'REJECTED'
 await expect.poll(async()=>(await api(page,`/admin/withdrawals/${withdrawal.id}/`)).body.status).toBe(expected)
 await page.reload();await expect(page.getByText(expected,{exact:true}).first()).toBeVisible()
 const duplicate=await api(page,`/admin/withdrawals/${withdrawal.id}/${action}/`,'POST',{remarks:'Duplicate synthetic processing'})
 expect(duplicate.status).toBe(400)
 await page.getByRole('button',{name:'Logout',exact:true}).click()
 await signIn(page,'visible-e2e-withdrawal@cash4us.local','VisibleE2E42')
 const after=(await api(page,'/v1/wallet/')).body
 expect(Number(after.pending_balance)).toBe(Number(before.pending_balance))
 expect(Number(after.balance)).toBe(Number(before.balance)-(action==='approve'?20:0))
 expect(Number(after.available_balance)).toBe(Number(before.available_balance)-(action==='approve'?20:0))
})

test('legacy approved withdrawal can be marked paid without a second debit',async({page})=>{
 await signIn(page,'visible-e2e-withdrawal@cash4us.local','VisibleE2E42')
 const before=(await api(page,'/v1/wallet/')).body
 await page.getByRole('button',{name:'Logout',exact:true}).click()
 await signIn(page,adminEmail!,adminPassword!,true)
 const list=await api(page,'/admin/withdrawals/?search=visible-e2e-withdrawal&status=APPROVED')
 const item=(list.body.results??list.body)[0];expect(item).toBeTruthy()
 await page.goto(`/admin/withdrawals/${item.id}`)
 await page.getByRole('button',{name:'Mark as Paid',exact:true}).click()
 await page.getByRole('button',{name:'Confirm',exact:true}).click()
 await expect.poll(async()=>(await api(page,`/admin/withdrawals/${item.id}/`)).body.status).toBe('PAID')
 expect((await api(page,`/admin/withdrawals/${item.id}/paid/`,'POST',{})).status).toBe(400)
 await page.getByRole('button',{name:'Logout',exact:true}).click()
 await signIn(page,'visible-e2e-withdrawal@cash4us.local','VisibleE2E42')
 const after=(await api(page,'/v1/wallet/')).body
 expect(after.balance).toBe(before.balance);expect(after.available_balance).toBe(before.available_balance);expect(after.pending_balance).toBe(before.pending_balance)
})
