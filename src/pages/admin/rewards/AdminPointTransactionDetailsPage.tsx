import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'
import { getAdminPointTransaction } from '../../../services/adminRewardService'

import type { AdminPointTransaction } from '../../../types/admin/rewards'

import PointTransactionTypeBadge from './components/PointTransactionTypeBadge'

export default function AdminPointTransactionDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()

  const [transaction, setTransaction] =
    useState<AdminPointTransaction | null>(null)

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

        setTransaction(
          await getAdminPointTransaction(
            id,
            accessToken,
          ),
        )
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load transaction.',
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
        to="/admin/rewards/point-transactions"
        className="text-sm font-semibold text-emerald-700"
      >
        ← Back to Point Transactions
      </Link>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!transaction ? (
        <Card>
          <p className="text-sm text-slate-500">
            Transaction not found.
          </p>
        </Card>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-slate-900">
            Point Transaction
          </h1>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <p className="text-sm text-slate-500">
                Amount
              </p>

              <p
                className={`mt-2 text-3xl font-bold ${
                  transaction.amount >= 0
                    ? 'text-emerald-700'
                    : 'text-red-600'
                }`}
              >
                {transaction.amount >= 0 ? '+' : ''}
                {transaction.amount.toLocaleString()}
              </p>
            </Card>

            <Card>
              <p className="text-sm text-slate-500">
                Type
              </p>

              <div className="mt-2">
                <PointTransactionTypeBadge
                  type={transaction.transaction_type}
                />
              </div>
            </Card>

            <Card>
              <p className="text-sm text-slate-500">
                Date
              </p>

              <p className="mt-2 font-semibold text-slate-900">
                {new Date(
                  transaction.created_at,
                ).toLocaleString('en-NG')}
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
                {transaction.member.username}
              </p>

              <p>
                <span className="text-slate-500">
                  Email:
                </span>{' '}
                {transaction.member.email}
              </p>

              <p>
                <span className="text-slate-500">
                  Membership Code:
                </span>{' '}
                {transaction.member.membership_code}
              </p>
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold text-slate-900">
              Transaction Information
            </h2>

            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="text-slate-500">
                  Reference:
                </span>{' '}
                {transaction.reference || '—'}
              </p>

              <p>
                <span className="text-slate-500">
                  Remarks:
                </span>{' '}
                {transaction.remarks || '—'}
              </p>

              <p>
                <span className="text-slate-500">
                  Transaction ID:
                </span>{' '}
                {transaction.id}
              </p>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}