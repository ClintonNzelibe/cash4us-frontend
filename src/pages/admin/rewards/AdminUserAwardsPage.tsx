import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import { getAdminUserAwards } from '../../../services/adminRewardService'

import type {
  AdminUserAward,
  RewardFilters as RewardFiltersType,
} from '../../../types/admin/rewards'

import RewardFilters from './components/RewardFilters'
import AwardPeriodBadge from './components/AwardPeriodBadge'

export default function AdminUserAwardsPage() {
  const { accessToken } = useAuth()

  const [userAwards, setUserAwards] =
    useState<AdminUserAward[]>([])

  const [filters, setFilters] =
    useState<RewardFiltersType>({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await getAdminUserAwards(
            accessToken,
            filters,
          )

        setUserAwards(
          Array.isArray(response)
            ? response
            : Array.isArray(response?.results)
              ? response.results
              : [],
        )
      } catch (error) {
        setUserAwards([])

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load user awards.',
        )
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => window.clearTimeout(timer)
  }, [accessToken, filters])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          User Awards
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View awards granted to members.
        </p>
      </div>

      <Card>
        <RewardFilters
          filters={filters}
          onChange={setFilters}
          mode="user-awards"
        />
      </Card>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <PageLoader />
      ) : (
        <Card className="overflow-hidden p-0">
          {userAwards.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No awarded achievements found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1000px] w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Member
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Award
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Points Required
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Period
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Awarded By
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Date
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {userAwards.map((userAward) => (
                    <tr
                      key={userAward.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {userAward.member.username}
                        </p>

                        <p className="text-xs text-slate-500">
                          {userAward.member.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {userAward.award.name}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-semibold text-emerald-700">
                        {userAward.award.points_required.toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <AwardPeriodBadge
                          period={
                            userAward.award.award_period
                          }
                        />
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {userAward.awarded_by_email ||
                          'System'}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {new Date(
                          userAward.awarded_at,
                        ).toLocaleDateString('en-NG')}
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          to={`/admin/rewards/user-awards/${userAward.id}`}
                          className="text-sm font-semibold text-emerald-700"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}