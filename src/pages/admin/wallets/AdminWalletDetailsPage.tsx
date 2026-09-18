import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import { getAdminWallet } from '../../../services/adminWalletService'

import type { AdminWallet } from '../../../types/admin/wallets'

import WalletBalanceCard from './components/WalletBalanceCard'
import WalletAddressCard from './components/WalletAddressCard'

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

export default function AdminWalletDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [wallet, setWallet] =
    useState<AdminWallet | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken || !id) {
      setLoading(false)
      return
    }

    async function loadWallet() {
      if (!accessToken || !id) return

      try {
        setLoading(true)
        setError('')

        const response = await getAdminWallet(
          id,
          accessToken,
        )

        setWallet(response)
      } catch (error) {
        setWallet(null)

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load wallet.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadWallet()
  }, [accessToken, id])

  if (loading) {
    return <PageLoader />
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/wallets"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Wallets
        </Link>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    )
  }

  if (!wallet) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/wallets"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Wallets
        </Link>

        <Card>
          <p className="text-sm text-slate-500">
            Wallet not found.
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
            to="/admin/wallets"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            ← Back to Wallets
          </Link>

          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            Wallet Details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Wallet information for {wallet.member.username}.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate('/admin/wallets')}
        >
          Back to Wallets
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Member
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {wallet.member.username}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {wallet.member.email}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {wallet.member.membership_code}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-400">
              Wallet ID
            </p>

            <p className="mt-1 break-all font-mono text-xs text-slate-600">
              {wallet.id}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <WalletBalanceCard
          label="Total Balance"
          value={wallet.balance}
          description="Current wallet balance"
        />

        <WalletBalanceCard
          label="Available Balance"
          value={wallet.available_balance}
          description="Available for withdrawals"
        />

        <WalletBalanceCard
          label="Pending Balance"
          value={wallet.pending_balance}
          description="Reserved for pending withdrawals"
        />
      </div>

      <Card>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Wallet Addresses
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Saved cryptocurrency addresses associated with this wallet.
          </p>
        </div>

        {wallet.addresses?.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {wallet.addresses.map((address) => (
              <WalletAddressCard
                key={address.id}
                address={address}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <p className="text-sm text-slate-500">
              No wallet addresses saved.
            </p>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-slate-900">
          Wallet Information
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-400">
              Created
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {formatDate(wallet.created_at)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">
              Last Updated
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {formatDate(wallet.updated_at)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}