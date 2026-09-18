import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'
import { getAdminPointAccount } from '../../../services/adminRewardService'

import type { AdminPointAccount } from '../../../types/admin/rewards'

export default function AdminPointAccountDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()

  const [account, setAccount] =
    useState<AdminPointAccount | null>(null)

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
        setError('')

        setAccount(
          await getAdminPointAccount(
            id,
            accessToken,
          ),
        )
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load point account.',
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
        to="/admin/rewards/points"
        className="text-sm font-semibold text-emerald-700"
      >
        ← Back to Point Accounts
      </Link>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!account ? (
        <Card>
          <p className="text-sm text-slate-500">
            Point account not found.
          </p>
        </Card>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Point Account
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {account.member.username}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <p className="text-sm text-slate-500">
                Current Balance
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-700">
                {account.balance.toLocaleString()}
              </p>
            </Card>

            <Card>
              <p className="text-sm text-slate-500">
                Lifetime Points
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {account.lifetime_points.toLocaleString()}
              </p>
            </Card>

            <Card>
              <p className="text-sm text-slate-500">
                Membership Code
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {account.member.membership_code}
              </p>
            </Card>
          </div>

          <Card>
            <h2 className="font-semibold text-slate-900">
              Member
            </h2>

            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="text-slate-500">
                  Username:
                </span>{' '}
                {account.member.username}
              </p>

              <p>
                <span className="text-slate-500">
                  Email:
                </span>{' '}
                {account.member.email}
              </p>

              <p>
                <span className="text-slate-500">
                  ID:
                </span>{' '}
                {account.member.id}
              </p>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}