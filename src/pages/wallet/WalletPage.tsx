import { useCallback, useEffect, useState } from 'react'
import {
  ArrowDownToLine,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  Wallet as WalletIcon,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import {
  createWalletAddress,
  deleteWalletAddress,
  getWallet,
} from '../../services/walletService'
import type {
  Wallet,
  WalletAddress,
  WalletNetwork,
} from '../../types/wallet'

const NETWORKS: WalletNetwork[] = [
  'TRC20',
  'BEP20',
  'ERC20',
  'BTC',
  'ETH',
  'SOL',
]

function formatAmount(value: string) {
  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return '0.00'
  }

  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function shortenAddress(address: string) {
  if (address.length <= 18) {
    return address
  }

  return `${address.slice(0, 9)}...${address.slice(-9)}`
}

export default function WalletPage() {
  const { accessToken } = useAuth()

  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showBalance, setShowBalance] = useState(true)

  const [showAddModal, setShowAddModal] = useState(false)
  const [network, setNetwork] = useState<WalletNetwork>('TRC20')
  const [address, setAddress] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const loadWallet = useCallback(
    async (isRefresh = false) => {
      if (!accessToken) {
        setError('Your session has expired. Please log in again.')
        setLoading(false)
        return
      }

      try {
        if (isRefresh) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        setError(null)

        const data = await getWallet(accessToken)
        setWallet(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load your wallet.',
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [accessToken],
  )

  useEffect(() => {
    loadWallet()
  }, [loadWallet])

  async function handleAddAddress() {
    if (!accessToken) {
      return
    }

    const trimmedAddress = address.trim()

    if (!trimmedAddress) {
      setFormError('Please enter a wallet address.')
      return
    }

    try {
      setSaving(true)
      setFormError(null)

      const newAddress = await createWalletAddress(accessToken, {
        network,
        address: trimmedAddress,
      })

      setWallet((current) =>
        current
          ? {
              ...current,
              addresses: [...current.addresses, newAddress],
            }
          : current,
      )

      setAddress('')
      setNetwork('TRC20')
      setShowAddModal(false)
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'Unable to save wallet address.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAddress(item: WalletAddress) {
    if (!accessToken) {
      return
    }

    const confirmed = window.confirm(
      `Remove your ${item.network} wallet address?`,
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteWalletAddress(accessToken, item.id)

      setWallet((current) =>
        current
          ? {
              ...current,
              addresses: current.addresses.filter(
                (addressItem) => addressItem.id !== item.id,
              ),
            }
          : current,
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to remove wallet address.',
      )
    }
  }

  async function copyAddress(value: string) {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Clipboard access can be unavailable in some browsers.
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-[#0F766E]" />
          <span>Loading your wallet...</span>
        </div>
      </div>
    )
  }

  if (error && !wallet) {
    return (
      <div className="mx-auto max-w-2xl py-10">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">{error}</p>

          <button
            type="button"
            onClick={() => loadWallet()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!wallet) {
    return null
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#0F766E]">My Wallet</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            Manage your funds
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            View your balance and manage your wallet addresses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadWallet(true)}
          disabled={refreshing}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] shadow-sm transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Balance card */}
      <section className="overflow-hidden rounded-3xl bg-[#071521] p-6 text-white shadow-lg sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F766E]">
              <WalletIcon className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-slate-300">Total Balance</p>
              <p className="text-xs text-slate-400">
                Available and pending funds
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowBalance((value) => !value)}
            className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            aria-label={showBalance ? 'Hide balance' : 'Show balance'}
          >
            {showBalance ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="mt-8">
          <p className="text-3xl font-bold tracking-tight sm:text-4xl">
            {showBalance
              ? `$${formatAmount(wallet.balance)}`
              : '••••••••'}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Your wallet balance
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Available Balance</p>
            <p className="mt-2 text-lg font-semibold">
              {showBalance
                ? `$${formatAmount(wallet.available_balance)}`
                : '••••••'}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">Pending Withdrawal</p>
            <p className="mt-2 text-lg font-semibold">
              {showBalance
                ? `$${formatAmount(wallet.pending_balance)}`
                : '••••••'}
            </p>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          className="group flex items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#0F766E]/30 hover:shadow-md"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#0F766E]">
            <ArrowDownToLine className="h-5 w-5" />
          </div>

          <div>
            <p className="font-semibold text-[#0F172A]">Withdraw Funds</p>
            <p className="mt-1 text-sm text-[#64748B]">
              Request a withdrawal from your available balance.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="group flex items-center gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#0F766E]/30 hover:shadow-md"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0F766E]">
            <Plus className="h-5 w-5" />
          </div>

          <div>
            <p className="font-semibold text-[#0F172A]">
              Add Wallet Address
            </p>
            <p className="mt-1 text-sm text-[#64748B]">
              Save an address for future withdrawals.
            </p>
          </div>
        </button>
      </div>

      {/* Addresses */}
      <section className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#E2E8F0] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-bold text-[#0F172A]">Wallet Addresses</h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Addresses saved to your account.
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-semibold text-[#64748B]">
            {wallet.addresses.length} saved
          </span>
        </div>

        {wallet.addresses.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FDFA] text-[#0F766E]">
              <WalletIcon className="h-6 w-6" />
            </div>

            <h3 className="mt-4 font-semibold text-[#0F172A]">
              No wallet addresses yet
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-[#64748B]">
              Add a wallet address to make future withdrawals easier.
            </p>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
            >
              <Plus className="h-4 w-4" />
              Add Address
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {wallet.addresses.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-[#ECFDF5] px-2.5 py-1 text-xs font-bold text-[#0F766E]">
                      {item.network}
                    </span>

                    {item.is_default && (
                      <span className="rounded-lg bg-[#F0FDFA] px-2.5 py-1 text-xs font-semibold text-[#115E59]">
                        Default
                      </span>
                    )}
                  </div>

                  <p
                    className="mt-2 break-all font-mono text-sm text-[#334155]"
                    title={item.address}
                  >
                    <span className="sm:hidden">
                      {shortenAddress(item.address)}
                    </span>
                    <span className="hidden sm:inline">
                      {item.address}
                    </span>
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyAddress(item.address)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm font-medium text-[#475569] transition hover:bg-[#F8FAFC]"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteAddress(item)}
                    className="rounded-xl border border-red-100 p-2 text-red-600 transition hover:bg-red-50"
                    aria-label={`Delete ${item.network} address`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add address modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-wallet-address-title"
            className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="add-wallet-address-title"
                  className="text-xl font-bold text-[#0F172A]"
                >
                  Add Wallet Address
                </h2>
                <p className="mt-1 text-sm text-[#64748B]">
                  Enter the address you want to save.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false)
                  setFormError(null)
                  setAddress('')
                }}
                className="text-2xl leading-none text-[#94A3B8] hover:text-[#0F172A]"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {formError && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="wallet-network"
                  className="mb-2 block text-sm font-medium text-[#334155]"
                >
                  Network
                </label>

                <select
                  id="wallet-network"
                  value={network}
                  onChange={(event) =>
                    setNetwork(event.target.value as WalletNetwork)
                  }
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                >
                  {NETWORKS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="wallet-address"
                  className="mb-2 block text-sm font-medium text-[#334155]"
                >
                  Wallet Address
                </label>

                <textarea
                  id="wallet-address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Enter wallet address"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[#E2E8F0] px-4 py-3 font-mono text-sm text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false)
                  setFormError(null)
                  setAddress('')
                }}
                className="rounded-xl border border-[#E2E8F0] px-5 py-3 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddAddress}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {saving ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}