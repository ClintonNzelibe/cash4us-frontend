import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import { getAdminUserAward } from '../../../services/adminRewardService'

import type { AdminUserAward } from '../../../types/admin/rewards'

import AwardPeriodBadge from './components/AwardPeriodBadge'

export default function AdminUserAwardDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()

  const [userAward, setUserAward] =
    useState<AdminUserAward | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken || !id) {
      setLoading(false)
      return
    }

    async function load() {
      if (!id || !accessToken) return

      try {
        setLoading(true)

        setUserAward(
          await getAdminUserAward(
            id,
            accessToken,
          ),
        )
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load user award.',
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [accessToken, id])

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <Link
        to="/admin/rewards/user-awards"
        className="text-sm font-semibold text-emerald-700"
      >
        ← Back to User Awards
      </Link>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!userAward ? (
        <Card>
          <p className="text-sm text-slate-500">
            User award not found.
          </p>
        </Card>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Awarded Achievement
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {userAward.award.name}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <p className="text-sm text-slate-500">
                Member
              </p>

              <p className="mt-2 font-bold text-slate-900">
                {userAward.member.username}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {userAward.member.email}
              </p>
            </Card>

            <Card>
              <p className="text-sm text-slate-500">
                Award
              </p>

              <p className="mt-2 font-bold text-slate-900">
                {userAward.award.name}
              </p>

              <div className="mt-2">
                <AwardPeriodBadge
                  period={userAward.award.award_period}
                />
              </div>
            </Card>

            <Card>
              <p className="text-sm text-slate-500">
                Points Required
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-700">
                {userAward.award.points_required.toLocaleString()}
              </p>
            </Card>
          </div>

          <Card>
            <h2 className="font-semibold text-slate-900">
              Award Information
            </h2>

            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="text-slate-500">
                  Awarded By:
                </span>{' '}
                {userAward.awarded_by_email ||
                  'System'}
              </p>

              <p>
                <span className="text-slate-500">
                  Awarded At:
                </span>{' '}
                {new Date(
                  userAward.awarded_at,
                ).toLocaleString('en-NG')}
              </p>

              <p>
                <span className="text-slate-500">
                  Period Key:
                </span>{' '}
                {userAward.period_key || '—'}
              </p>

              <p>
                <span className="text-slate-500">
                  Remarks:
                </span>{' '}
                {userAward.remarks || '—'}
              </p>
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-slate-900">
              Qualification Snapshot
            </h2>

            <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-50 p-4 text-xs text-slate-700">
              {JSON.stringify(
                userAward.qualification_snapshot,
                null,
                2,
              )}
            </pre>
          </Card>
        </>
      )}
    </div>
  )
}