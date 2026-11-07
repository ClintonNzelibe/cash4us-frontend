import { useEffect, useRef, useState } from 'react'
import { Gift, History, ShieldCheck } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import { getAdminPackages } from '../../../services/adminPackageService'
import { createPackageGrant, getMemberGrants, retireTestGrant } from '../../../services/adminGrantService'
import type { GrantRequest, PackageGrant } from '../../../services/adminGrantService'
import type { AdminPackage } from '../../../types/admin/packages'

export default function PackageGrantPanel({ memberId, memberEmail, token, onGranted }: {
  memberId: string; memberEmail: string; token: string; onGranted: () => void
}) {
  const [history, setHistory] = useState<PackageGrant[]>([])
  const [canGrant, setCanGrant] = useState(false)
  const [canRetire, setCanRetire] = useState(false)
  const [testRun, setTestRun] = useState('')
  const [retiring, setRetiring] = useState<PackageGrant | null>(null)
  const [retirementReason, setRetirementReason] = useState('')
  const [packages, setPackages] = useState<AdminPackage[]>([])
  const [open, setOpen] = useState(false)
  const [packageId, setPackageId] = useState('')
  const [tenureId, setTenureId] = useState('')
  const [reason, setReason] = useState('')
  const [reference, setReference] = useState('')
  const [review, setReview] = useState<GrantRequest | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const key = useRef(crypto.randomUUID())
  const submitting = useRef(false)
  useEffect(() => {
    let current = true
    Promise.all([getMemberGrants(memberId, token), getAdminPackages(token, { is_active: true })])
      .then(([grants, items]) => {
        if (!current) return
        setHistory(grants.results); setCanGrant(grants.can_grant); setCanRetire(grants.can_retire)
        setPackages((Array.isArray(items) ? items : items.results ?? []).filter(item => item.is_active))
      }).catch(err => { if (current) setError(err instanceof Error ? err.message : 'Unable to load grant history.') })
    return () => { current = false }
  }, [memberId, token])
  const selected = packages.find(item => item.id === packageId)
  const tenure = selected?.tenures.find(item => item.id === tenureId && item.is_active)

  async function confirm() {
    if (!review || submitting.current) return
    submitting.current = true; setBusy(true); setError('')
    try {
      const result = await createPackageGrant(review, token)
      setHistory(current => [result.grant, ...current.filter(item => item.id !== result.grant.id)])
      setNotice(result.replayed ? 'Existing administrative grant confirmed. No duplicate activation.' : 'Package granted successfully. Source: ADMIN_GRANT.')
      setOpen(false); setReview(null); setReason(''); setReference(''); setTestRun('')
      key.current = crypto.randomUUID()
      onGranted()
    } catch (err) {
      // Keep the exact reviewed payload/key for a safe retry after uncertain transport.
      setError(err instanceof Error ? err.message : 'Unable to grant package. Retry the same request safely.')
    } finally { submitting.current = false; setBusy(false) }
  }

  async function confirmRetirement() {
    if (!retiring || !retirementReason.trim() || submitting.current) return
    submitting.current = true; setBusy(true); setError('')
    try {
      await retireTestGrant(retiring.id, retirementReason.trim(), token)
      const grants = await getMemberGrants(memberId, token)
      setHistory(grants.results); setRetiring(null); setRetirementReason('')
      setNotice('Test grant retired. Future earnings stopped; financial and audit history retained.')
      onGranted()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to confirm retirement. Retry the same reason safely.')
    } finally { submitting.current = false; setBusy(false) }
  }

  return <Card className="overflow-hidden">
    <section aria-label="Administrative package grants" className="space-y-5 p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-3"><span className="rounded-xl bg-emerald-50 p-3 text-teal-700"><Gift size={22} /></span>
          <div><h2 className="text-lg font-bold text-slate-900">Administrative package grants</h2>
            <p className="mt-1 text-sm text-slate-500">Activate a membership with an auditable administrative authorization.</p></div></div>
        <Button disabled={!canGrant || busy} onClick={() => { setOpen(!open); setError(''); setNotice('') }}>Grant package</Button>
      </div>
      {!canGrant && <p className="text-sm text-slate-500">Explicit package grant permission is required to create a grant.</p>}
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p>}
      {open && !review && <form className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2" onSubmit={event => {
        event.preventDefault(); setError('')
        if (!tenure || !reason.trim() || !reference.trim()) { setError('Select a package and tenure and provide a reason and purchase reference.'); return }
        setReview({ member: memberId, package: packageId, tenure: tenureId, reason: reason.trim(), purchase_reference: reference.trim(), idempotency_key: key.current, ...(testRun.trim() ? { test_run: testRun.trim() } : {}) })
      }}>
        <label className="text-sm font-medium text-slate-700">Package<select aria-label="Package" required value={packageId} onChange={event => { setPackageId(event.target.value); setTenureId('') }} className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3"><option value="">Select package</option>{packages.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="text-sm font-medium text-slate-700">Tenure<select aria-label="Tenure" required disabled={!selected} value={tenureId} onChange={event => setTenureId(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3"><option value="">Select tenure</option>{selected?.tenures.filter(item => item.is_active).map(item => <option key={item.id} value={item.id}>{item.duration_days} days</option>)}</select></label>
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">Purchase / case reference<input aria-label="Purchase / case reference" required maxLength={100} pattern="[A-Za-z0-9][A-Za-z0-9_.:/-]*" value={reference} onChange={event => setReference(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 p-3" placeholder="Unique approved purchase or case reference" /></label>
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">Reason<textarea aria-label="Reason" required maxLength={2000} rows={3} value={reason} onChange={event => setReason(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 p-3" placeholder="Why is this administrative activation authorized?" /></label>
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">Test run (optional)<input aria-label="Test run" maxLength={80} pattern="[A-Za-z0-9][A-Za-z0-9_.-]*" value={testRun} onChange={event => setTestRun(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 p-3" /><span className="mt-1 block text-xs text-slate-500">Explicitly marks this new grant as a test that an authorized administrator can retire. Leave empty for a normal grant.</span></label>
        <div className="sm:col-span-2"><Button type="submit">Review grant</Button></div>
      </form>}
      {open && review && <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <h3 className="flex items-center gap-2 font-bold text-teal-900"><ShieldCheck size={20} />Review administrative grant</h3>
        <dl className="grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-slate-500">Member</dt><dd>{memberEmail}</dd></div><div><dt className="text-slate-500">Package / tenure</dt><dd>{selected?.name} · {tenure?.duration_days} days</dd></div><div><dt className="text-slate-500">Reference</dt><dd>{review.purchase_reference}</dd></div><div><dt className="text-slate-500">Source</dt><dd className="font-bold">ADMIN_GRANT</dd></div><div className="sm:col-span-2"><dt className="text-slate-500">Reason</dt><dd className="whitespace-pre-wrap break-words">{review.reason}</dd></div></dl>
        <p className="text-sm text-teal-900">No blockchain payment is recorded. No referral commissions or referral points are issued. Existing package earnings rules apply.</p>
        <div className="flex flex-wrap gap-3"><Button disabled={busy} onClick={() => void confirm()}>{busy ? 'Granting…' : 'Confirm package grant'}</Button><Button variant="outline" disabled={busy} onClick={() => setReview(null)}>Edit details</Button></div>
      </div>}
      {review?.test_run && <p className="text-sm font-semibold text-amber-900">Designated test run: {review.test_run}</p>}
      {retiring && <form aria-label="Retire test grant" className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4" onSubmit={event => { event.preventDefault(); void confirmRetirement() }}><p className="font-semibold">Retire test grant {retiring.test_run}</p><p className="text-sm">Future earnings stop permanently. Existing balances and immutable audit history are retained.</p><label className="block text-sm">Retirement reason<textarea aria-label="Retirement reason" required maxLength={2000} value={retirementReason} onChange={event => setRetirementReason(event.target.value)} className="mt-2 w-full rounded-xl border p-3" /></label><div className="flex gap-3"><Button type="submit" disabled={busy || !retirementReason.trim()}>Confirm retirement</Button><Button variant="outline" disabled={busy} onClick={() => setRetiring(null)}>Cancel retirement</Button></div></form>}
      <div className="border-t border-slate-100 pt-4"><h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700"><History size={17} />Grant history</h3>
        {history.length === 0 ? <p className="text-sm text-slate-500">No administrative package grants.</p> : <ul className="space-y-3">{history.map(item => <li key={item.id} className="rounded-xl border border-slate-200 p-4 text-sm"><div className="flex flex-wrap justify-between gap-2"><strong>{item.snapshot.package_name} · {item.snapshot.duration_days} days</strong><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-teal-800">ADMIN_GRANT · {item.cycle_status}</span></div><p className="mt-2 whitespace-pre-wrap break-words text-slate-700">{item.reason}</p><p className="mt-2 text-xs text-slate-500">{item.purchase_reference} · {item.snapshot.administrator_email} · {new Date(item.created_at).toLocaleString()}</p>{item.test_run && <p className="mt-2 text-xs font-semibold text-slate-600">TEST · {item.test_run}{item.retired_at ? ` · Retired ${new Date(item.retired_at).toLocaleString()}` : ""}</p>}{canRetire && item.test_run && !item.retired_at && <Button variant="outline" disabled={busy} onClick={() => { setRetiring(item); setRetirementReason(""); setError("") }}>Retire test grant</Button>}</li>)}</ul>}
      </div>
    </section>
  </Card>
}
