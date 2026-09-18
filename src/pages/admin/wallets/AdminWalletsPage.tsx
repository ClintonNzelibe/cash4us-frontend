import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'
import Button from '../../../components/ui/Button'

import { useAuth } from '../../../context/AuthContext'

import { getAdminWallets } from '../../../services/adminWalletService'

import type {
  AdminWallet,
  WalletFilters,
} from '../../../types/admin/wallets'

import WalletFiltersComponent from './components/WalletFilters'

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(Number(value))
}

export default function AdminWalletsPage() {
  const { accessToken } = useAuth()

  const [wallets, setWallets] = useState<AdminWallet[]>([])
  const [filters, setFilters] = useState<WalletFilters>({})

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

        const response = await getAdminWallets(
          accessToken,
          filters,
        )

        if (Array.isArray(response)) {
          setWallets(response)
        } else {
          setWallets(
            Array.isArray(response?.results)
              ? response.results
              : [],
          )
        }
      } catch (error) {
        setWallets([])

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load wallets.',
        )
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => window.clearTimeout(timer)
  }, [accessToken, filters])

  const totalBalance = wallets.reduce(
    (sum, wallet) =>
      sum + Number(wallet.balance || 0),
    0,
  )

  const totalAvailableBalance = wallets.reduce(
    (sum, wallet) =>
      sum + Number(wallet.available_balance || 0),
    0,
  )

  const totalPendingBalance = wallets.reduce(
    (sum, wallet) =>
      sum + Number(wallet.pending_balance || 0),
    0,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Wallets
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View member wallet balances and saved wallet addresses.
          </p>
        </div>

        <Link to="/admin/transactions">
          <Button variant="secondary">
            View Transactions
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500">
            Wallets Loaded
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {wallets.length}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Total Balance
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(totalBalance)}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Available Balance
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-700">
            {formatCurrency(totalAvailableBalance)}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">
            Pending Balance
          </p>

          <p className="mt-2 text-2xl font-bold text-amber-600">
            {formatCurrency(totalPendingBalance)}
          </p>
        </Card>
      </div>

      <WalletFiltersComponent
        filters={filters}
        onChange={setFilters}
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <PageLoader />
      ) : (
        <Card className="overflow-hidden p-0">
          {wallets.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No wallets found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Member
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Balance
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Available
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Pending
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Addresses
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {wallets.map((wallet) => (
                    <tr
                      key={wallet.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <Link
                          to={`/admin/wallets/${wallet.id}`}
                          className="font-semibold text-slate-900 hover:text-emerald-700"
                        >
                          {wallet.member.username}
                        </Link>

                        <p className="mt-1 text-xs text-slate-500">
                          {wallet.member.email}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {wallet.member.membership_code}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                        {formatCurrency(wallet.balance)}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-emerald-700">
                        {formatCurrency(
                          wallet.available_balance,
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-amber-600">
                        {formatCurrency(
                          wallet.pending_balance,
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {wallet.addresses?.length ?? 0}
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          to={`/admin/wallets/${wallet.id}`}
                          className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
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