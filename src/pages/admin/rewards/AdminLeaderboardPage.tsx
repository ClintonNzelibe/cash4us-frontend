import { useEffect, useState } from 'react'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'
import { getAdminLeaderboard } from '../../../services/adminRewardService'

import type { AdminPointAccount } from '../../../types/admin/rewards'

export default function AdminLeaderboardPage() {
  const { accessToken } = useAuth()

  const [leaders, setLeaders] = useState<AdminPointAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    const token = accessToken

    async function load() {
      try {
        setLoading(true)
        setError('')

        const response = await getAdminLeaderboard(
          token,
          100,
        )

        setLeaders(
          Array.isArray(response)
            ? response
            : Array.isArray(response?.results)
              ? response.results
              : [],
        )
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load leaderboard.',
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [accessToken])

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Leaderboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Members ranked by lifetime reward points.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card className="overflow-hidden p-0">
        {leaders.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No leaderboard data found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                    Rank
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                    Member
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                    Current Points
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                    Lifetime Points
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {leaders.map((leader, index) => (
                  <tr
                    key={leader.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-bold text-slate-900">
                      #{index + 1}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {leader.member.username}
                      </p>

                      <p className="text-xs text-slate-500">
                        {leader.member.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-semibold text-emerald-700">
                      {leader.balance.toLocaleString()}
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-900">
                      {leader.lifetime_points.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}