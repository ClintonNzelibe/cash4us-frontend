import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import { getAdminTransaction } from '../../../services/adminTransactionService'

import type { AdminTransaction } from '../../../types/admin/transactions'

import TransactionDirectionBadge from './components/TransactionDirectionBadge'
import TransactionTypeBadge from './components/TransactionTypeBadge'

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(Number(value))
}

function formatDate(value: string | null) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function DetailItem({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-700">
        {value || '—'}
      </p>
    </div>
  )
}

export default function AdminTransactionDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()

  const [transaction, setTransaction] =
    useState<AdminTransaction | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken || !id) {
      setLoading(false)
      return
    }

    async function loadTransaction() {
      if (!accessToken || !id) return

      try {
        setLoading(true)
        setError('')

        const response =
          await getAdminTransaction(
            id,
            accessToken,
          )

        setTransaction(response)
      } catch (error) {
        setTransaction(null)

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load transaction.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadTransaction()
  }, [accessToken, id])

  if (loading) {
    return <PageLoader />
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/transactions"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Transactions
        </Link>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/transactions"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Transactions
        </Link>

        <Card>
          <p className="text-sm text-slate-500">
            Transaction not found.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            to="/admin/transactions"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            ← Back to Transactions
          </Link>

          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            Transaction Details
          </h1>

          <p className="mt-1 font-mono text-sm text-slate-500">
            {transaction.reference}
          </p>
        </div>

        <Link to="/admin/transactions">
          <Button variant="secondary">
            Back to Transactions
          </Button>
        </Link>
      </div>

      <Card>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Transaction Amount
            </p>

            <p
              className={`mt-2 text-3xl font-bold ${
                transaction.direction ===
                'CREDIT'
                  ? 'text-emerald-700'
                  : 'text-red-600'
              }`}
            >
              {transaction.direction ===
              'CREDIT'
                ? '+'
                : '-'}
              {formatCurrency(
                transaction.amount,
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <TransactionTypeBadge
              type={transaction.transaction_type}
            />

            <TransactionDirectionBadge
              direction={transaction.direction}
            />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-slate-900">
          Member
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem
            label="Username"
            value={transaction.member.username}
          />

          <DetailItem
            label="Email"
            value={transaction.member.email}
          />

          <DetailItem
            label="Membership Code"
            value={
              transaction.member.membership_code
            }
          />

          <DetailItem
            label="Member ID"
            value={transaction.member.id}
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-slate-900">
          Transaction Information
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem
            label="Reference"
            value={transaction.reference}
          />

          <DetailItem
            label="Transaction ID"
            value={transaction.id}
          />

          <DetailItem
            label="Transaction Type"
            value={transaction.transaction_type}
          />

          <DetailItem
            label="Direction"
            value={transaction.direction}
          />

          <DetailItem
            label="Balance Before"
            value={formatCurrency(
              transaction.balance_before,
            )}
          />

          <DetailItem
            label="Balance After"
            value={formatCurrency(
              transaction.balance_after,
            )}
          />

          <DetailItem
            label="Created"
            value={formatDate(
              transaction.created_at,
            )}
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-slate-900">
          Description
        </h2>

        <div className="mt-4 rounded-lg bg-slate-50 p-4">
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {transaction.description ||
              'No description provided.'}
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-slate-900">
          Related Object
        </h2>

        {transaction.related_object ? (
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <DetailItem
              label="Type"
              value={
                transaction.related_object.type
              }
            />

            <DetailItem
              label="Object ID"
              value={
                transaction.related_object.id
              }
            />
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            No related object linked to this transaction.
          </p>
        )}
      </Card>
    </div>
  )
}