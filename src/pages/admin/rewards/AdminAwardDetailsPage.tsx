import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'
import Button from '../../../components/ui/Button'

import { useAuth } from '../../../context/AuthContext'

import {
  getAdminAward,
  awardUser,
  processWeeklyAward,
} from '../../../services/adminRewardService'

import type { AdminAward } from '../../../types/admin/rewards'

import AwardStatusBadge from './components/AwardStatusBadge'
import AwardPeriodBadge from './components/AwardPeriodBadge'
import AwardActionModal from './components/AwardActionModal'

export default function AdminAwardDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()

  const [award, setAward] =
    useState<AdminAward | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [grantOpen, setGrantOpen] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!accessToken || !id) {
      setLoading(false)
      return
    }

    async function load() {
      if (!id || !accessToken) return

      try {
        setLoading(true)

        setAward(
          await getAdminAward(
            id,
            accessToken,
          ),
        )
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load award.',
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [accessToken, id])

  async function grant(
    userId: string,
    remarks: string,
  ) {
    if (!accessToken || !id) return

    try {
      setProcessing(true)
      setError('')

      await awardUser(
        id,
        userId,
        remarks,
        accessToken,
      )

      setGrantOpen(false)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to grant award.',
      )
    } finally {
      setProcessing(false)
    }
  }

  async function processWeekly() {
    if (!accessToken || !id) return

    try {
      setProcessing(true)
      setError('')

      await processWeeklyAward(
        id,
        accessToken,
      )

      const updated = await getAdminAward(
        id,
        accessToken,
      )

      setAward(updated)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to process weekly award.',
      )
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <Link
        to="/admin/rewards/awards"
        className="text-sm font-semibold text-emerald-700"
      >
        ← Back to Awards
      </Link>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!award ? (
        <Card>
          <p className="text-sm text-slate-500">
            Award not found.
          </p>
        </Card>
      ) : (
        <>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {award.name}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {award.description || 'No description'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <AwardStatusBadge
                status={award.status}
              />

              <AwardPeriodBadge
                period={award.award_period}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <p className="text-sm text-slate-500">
                Points Required
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-700">
                {award.points_required.toLocaleString()}
              </p>
            </Card>

            <Card>
              <p className="text-sm text-slate-500">
                Winners
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {award.number_of_winners}
              </p>
            </Card>

            <Card>
              <p className="text-sm text-slate-500">
                Awarded
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {award.awarded_count}
              </p>
            </Card>

            <Card>
              <p className="text-sm text-slate-500">
                Active
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-700">
                {award.is_active ? 'Yes' : 'No'}
              </p>
            </Card>
          </div>

          <Card>
            <h2 className="font-semibold text-slate-900">
              Award Information
            </h2>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-xs uppercase text-slate-400">
                  Criteria
                </p>
                <p className="mt-1 text-slate-700">
                  {award.criteria || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-400">
                  Date Range
                </p>
                <p className="mt-1 text-slate-700">
                  {award.start_date || 'No start date'}
                  {' — '}
                  {award.end_date || 'No end date'}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-400">
                  Qualification Rules
                </p>

                <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-50 p-4 text-xs text-slate-700">
                  {JSON.stringify(
                    award.qualification_rules,
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-slate-900">
              Actions
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={`/admin/rewards/awards/${award.id}/edit`}
              >
                <Button variant="secondary">
                  Edit Award
                </Button>
              </Link>

              <Button
                onClick={() => setGrantOpen(true)}
              >
                Award Member
              </Button>

              {award.award_period === 'WEEKLY' && (
                <Button
                  variant="secondary"
                  disabled={processing}
                  onClick={processWeekly}
                >
                  {processing
                    ? 'Processing...'
                    : 'Process Weekly Award'}
                </Button>
              )}
            </div>
          </Card>
        </>
      )}

      <AwardActionModal
        open={grantOpen}
        title="Award Member"
        description="Grant this award to a qualifying member."
        confirmLabel="Grant Award"
        submitting={processing}
        requireUserId
        onClose={() => setGrantOpen(false)}
        onConfirm={grant}
      />
    </div>
  )
}