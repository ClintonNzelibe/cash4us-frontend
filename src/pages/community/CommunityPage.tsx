import { useEffect, useState } from 'react'

import { apiClient } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

type CommunityEarning = {
  id: string
  amount: string
  status: string
}

export default function CommunityPage() {
  const { accessToken } = useAuth()
  const [earnings, setEarnings] = useState<CommunityEarning[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) return

    apiClient<CommunityEarning[]>('/v1/community/member/earnings/', {
      method: 'GET',
      token: accessToken,
    })
      .then(setEarnings)
      .catch((requestError) => setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to load community earnings.',
      ))
      .finally(() => setLoading(false))
  }, [accessToken])

  const total = earnings.reduce(
    (sum, earning) => sum + Number(earning.amount),
    0,
  )

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-medium text-emerald-700">Community</p>
        <h2 className="mt-1 text-3xl font-bold text-slate-900">
          Community Earnings
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          View earnings distributed to your Cash4Us account.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Total community earnings</p>
        <p className="mt-1 text-3xl font-bold text-emerald-700">
          ${total.toFixed(2)}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-slate-500">Loading community earnings…</p>
        ) : error ? (
          <p className="p-6 text-sm text-red-600">{error}</p>
        ) : earnings.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">
            No community earnings have been distributed to your account yet.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {earnings.map((earning) => (
              <li key={earning.id} className="flex items-center justify-between p-5">
                <span className="text-sm font-medium text-slate-800">{earning.status}</span>
                <span className="font-semibold text-emerald-700">
                  ${Number(earning.amount).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
