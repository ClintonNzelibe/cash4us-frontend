import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'
import Button from '../../../components/ui/Button'

import { useAuth } from '../../../context/AuthContext'

import {
  getAdminAwards,
  updateAdminAwardStatus,
} from '../../../services/adminRewardService'

import type {
  AdminAward,
  RewardFilters as RewardFiltersType,
} from '../../../types/admin/rewards'

import AwardStatusBadge from './components/AwardStatusBadge'
import AwardPeriodBadge from './components/AwardPeriodBadge'
import RewardFilters from './components/RewardFilters'

export default function AdminAwardsPage() {
  const { accessToken } = useAuth()

  const [awards, setAwards] = useState<AdminAward[]>([])
  const [filters, setFilters] =
    useState<RewardFiltersType>({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadAwards() {
    if (!accessToken) return

    try {
      setLoading(true)
      setError('')

      const response = await getAdminAwards(
        accessToken,
        filters,
      )

      setAwards(
        Array.isArray(response)
          ? response
          : Array.isArray(response?.results)
            ? response.results
            : [],
      )
    } catch (error) {
      setAwards([])

      setError(
        error instanceof Error
          ? error.message
          : 'Failed to load awards.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAwards()
  }, [accessToken, filters])

  async function toggleStatus(
    award: AdminAward,
  ) {
    if (!accessToken) return

    try {
      await updateAdminAwardStatus(
        award.id,
        !award.is_active,
        accessToken,
      )

      await loadAwards()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update award status.',
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Awards
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage member achievement awards.
          </p>
        </div>

        <Link to="/admin/rewards/awards/create">
          <Button>Create Award</Button>
        </Link>
      </div>

      <Card>
        <RewardFilters
          filters={filters}
          onChange={setFilters}
          mode="awards"
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
          {awards.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No awards found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Award
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Points
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Winners
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Period
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Status
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Awarded
                    </th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {awards.map((award) => (
                    <tr
                      key={award.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {award.name}
                        </p>

                        <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                          {award.description || 'No description'}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-semibold text-emerald-700">
                        {award.points_required.toLocaleString()}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {award.number_of_winners}
                      </td>

                      <td className="px-5 py-4">
                        <AwardPeriodBadge
                          period={award.award_period}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <AwardStatusBadge
                          status={award.status}
                        />
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {award.awarded_count}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/admin/rewards/awards/${award.id}`}
                            className="text-sm font-semibold text-emerald-700"
                          >
                            View
                          </Link>

                          <Link
                            to={`/admin/rewards/awards/${award.id}/edit`}
                            className="text-sm font-semibold text-slate-600"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              toggleStatus(award)
                            }
                            className="text-sm font-semibold text-slate-600"
                          >
                            {award.is_active
                              ? 'Deactivate'
                              : 'Activate'}
                          </button>
                        </div>
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