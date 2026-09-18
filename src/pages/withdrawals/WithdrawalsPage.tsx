import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  
  Loader2,
  Wallet,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getWallet } from '../../services/walletService'
import {
  createWithdrawal,
  getWithdrawals,
} from '../../services/withdrawalService'
import type { Wallet as WalletData } from '../../types/wallet'
import type {
  Withdrawal,
  WithdrawalNetwork,
} from '../../types/withdrawal'

const networks: {
  value: WithdrawalNetwork
  label: string
}[] = [
  { value: 'TRC20', label: 'TRC20' },
  { value: 'BEP20', label: 'BEP20' },
  { value: 'ERC20', label: 'ERC20' },
  { value: 'BTC', label: 'Bitcoin (BTC)' },
  { value: 'ETH', label: 'Ethereum (ETH)' },
  { value: 'SOL', label: 'Solana (SOL)' },
]

const statusStyles: Record<string, string> = {
  PENDING:
    'border-amber-200 bg-amber-50 text-amber-700',
  APPROVED:
    'border-blue-200 bg-blue-50 text-blue-700',
  REJECTED:
    'border-red-200 bg-red-50 text-red-700',
  PAID:
    'border-emerald-200 bg-emerald-50 text-emerald-700',
}

function formatMoney(value: string | number) {
  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return String(value)
  }

  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function shortenAddress(address: string) {
  if (address.length <= 18) {
    return address
  }

  return `${address.slice(0, 9)}...${address.slice(-7)}`
}

function CopyAddress({
  address,
}: {
  address: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 1500)
    } catch {
      // Clipboard may not be available.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      title="Copy address"
    >
      <Copy className="h-3.5 w-3.5" />
      <span className="sr-only">
        {copied ? 'Copied' : 'Copy address'}
      </span>
    </button>
  )
}

function StatusBadge({
  status,
}: {
  status: string
}) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        statusStyles[status] ||
        'border-slate-200 bg-slate-50 text-slate-600'
      }`}
    >
      {status}
    </span>
  )
}

function WithdrawalCard({
  withdrawal,
  onView,
}: {
  withdrawal: Withdrawal
  onView: (withdrawal: Withdrawal) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onView(withdrawal)}
      className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 sm:p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[#0F766E]">
            <Wallet className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#0F172A]">
              {formatMoney(withdrawal.amount)}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {withdrawal.destination_network} ·{' '}
              {shortenAddress(
                withdrawal.destination_address,
              )}
            </p>
          </div>
        </div>

        <StatusBadge status={withdrawal.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            Fee
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {formatMoney(withdrawal.admin_fee)}
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            You'll receive
          </p>

          <p className="mt-1 text-sm font-semibold text-[#0F766E]">
            {formatMoney(withdrawal.net_amount)}
          </p>
        </div>

        <div className="hidden sm:block">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            Requested
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {formatDate(withdrawal.requested_at)}
          </p>
        </div>
      </div>
    </button>
  )
}

function WithdrawalDetailsModal({
  withdrawal,
  onClose,
}: {
  withdrawal: Withdrawal
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
              Withdrawal
            </p>

            <h2 className="mt-1 text-lg font-semibold text-[#0F172A]">
              Withdrawal details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
            <div>
              <p className="text-xs text-slate-500">
                Amount requested
              </p>

              <p className="mt-1 text-xl font-bold text-[#0F172A]">
                {formatMoney(withdrawal.amount)}
              </p>
            </div>

            <StatusBadge status={withdrawal.status} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-400">
                Network
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {withdrawal.destination_network}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Administrative fee
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {formatMoney(withdrawal.admin_fee)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Net payout
              </p>

              <p className="mt-1 text-sm font-semibold text-[#0F766E]">
                {formatMoney(withdrawal.net_amount)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Requested
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {formatDateTime(
                  withdrawal.requested_at,
                )}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-400">
              Destination address
            </p>

            <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <p className="break-all text-xs text-slate-600">
                {withdrawal.destination_address}
              </p>

              <CopyAddress
                address={withdrawal.destination_address}
              />
            </div>
          </div>

          {withdrawal.processed_at && (
            <div>
              <p className="text-xs text-slate-400">
                Processed
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {formatDateTime(
                  withdrawal.processed_at,
                )}
              </p>
            </div>
          )}

          {withdrawal.remarks && (
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Remarks
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-700">
                {withdrawal.remarks}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RequestWithdrawalModal({
  wallet,
  token,
  onClose,
  onSuccess,
}: {
  wallet: WalletData
  token: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [network, setNetwork] =
    useState<WithdrawalNetwork>('TRC20')

  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const numericAmount = Number(amount)

  const estimatedFee =
    numericAmount > 0 ? numericAmount * 0.1 : 0

  const estimatedNet =
    numericAmount > 0
      ? numericAmount - estimatedFee
      : 0

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault()
    setError('')

    const value = Number(amount)

    if (!address.trim()) {
      setError(
        'Please enter your destination wallet address.',
      )
      return
    }

    if (!amount || Number.isNaN(value)) {
      setError('Please enter a valid withdrawal amount.')
      return
    }

    if (value < 10) {
      setError('The minimum withdrawal amount is $10.00.')
      return
    }

    try {
      setIsSubmitting(true)

      await createWithdrawal(token, {
        destination_network: network,
        destination_address: address.trim(),
        amount: amount,
      })

      onSuccess()
      onClose()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to submit withdrawal request.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
              Wallet
            </p>

            <h2 className="mt-1 text-lg font-semibold text-[#0F172A]">
              Request withdrawal
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Withdraw your available balance.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >
          {error && (
            <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-xs font-medium text-emerald-700">
              Available balance
            </p>

            <p className="mt-1 text-2xl font-bold text-[#0F766E]">
              {formatMoney(wallet.available_balance)}
            </p>
          </div>

          <div>
            <label
              htmlFor="withdrawal-network"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Destination network
            </label>

            <select
              id="withdrawal-network"
              value={network}
              onChange={(event) =>
                setNetwork(
                  event.target.value as WithdrawalNetwork,
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-emerald-100"
            >
              {networks.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="withdrawal-address"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Destination wallet address
            </label>

            <input
              id="withdrawal-address"
              type="text"
              value={address}
              onChange={(event) =>
                setAddress(event.target.value)
              }
              placeholder="Enter wallet address"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-emerald-100"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Make sure the address matches the selected
              network.
            </p>
          </div>

          <div>
            <label
              htmlFor="withdrawal-amount"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Withdrawal amount
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                $
              </span>

              <input
                id="withdrawal-amount"
                type="number"
                min="10"
                step="0.01"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                placeholder="0.00"
                className="w-full rounded-xl border border-slate-300 py-3 pl-8 pr-4 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <p className="mt-1.5 text-xs text-slate-400">
              Minimum withdrawal: $10.00
            </p>
          </div>

          {numericAmount >= 10 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Withdrawal amount
                </span>

                <span className="font-medium text-slate-700">
                  {formatMoney(numericAmount)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Administrative fee
                </span>

                <span className="font-medium text-slate-700">
                  {formatMoney(estimatedFee)}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                <span className="text-sm font-semibold text-slate-700">
                  Estimated payout
                </span>

                <span className="text-lg font-bold text-[#0F766E]">
                  {formatMoney(estimatedNet)}
                </span>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <div className="flex gap-3">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Withdrawal schedule
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700">
                  Withdrawals are available every Thursday
                  from 9:00 AM to 5:00 PM.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Request Withdrawal
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function WithdrawalsPage() {
  const { accessToken } = useAuth()

  const [wallet, setWallet] =
    useState<WalletData | null>(null)

  const [withdrawals, setWithdrawals] =
    useState<Withdrawal[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [showRequestModal, setShowRequestModal] =
    useState(false)

  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<Withdrawal | null>(null)

  const loadData = async () => {
    if (!accessToken) return

    try {
      setIsLoading(true)
      setError('')

      const [walletData, withdrawalData] =
        await Promise.all([
          getWallet(accessToken),
          getWithdrawals(accessToken),
        ])

      setWallet(walletData)
      setWithdrawals(withdrawalData)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load withdrawals.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [accessToken])

  const pendingCount = useMemo(
    () =>
      withdrawals.filter(
        (item) => item.status === 'PENDING',
      ).length,
    [withdrawals],
  )

  const totalWithdrawn = useMemo(
    () =>
      withdrawals
        .filter((item) => item.status === 'PAID')
        .reduce(
          (total, item) =>
            total + Number(item.net_amount),
          0,
        ),
    [withdrawals],
  )

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px]">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-44 rounded-lg bg-slate-200" />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 rounded-2xl bg-white"
              />
            ))}
          </div>

          <div className="h-72 rounded-2xl bg-white" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] space-y-7">
      {/* Header */}
      <section>
        <p className="text-sm font-medium text-[#0F766E]">
          Manage your payouts
        </p>

        <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Withdrawals
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Request a payout from your available wallet
              balance.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowRequestModal(true)
            }
            disabled={!wallet}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Wallet className="h-4 w-4" />
            Request Withdrawal
          </button>
        </div>
      </section>

      {error && (
        <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#0F766E]">
            <Wallet className="h-4.5 w-4.5" />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Available balance
          </p>

          <p className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">
            {wallet
              ? formatMoney(wallet.available_balance)
              : '$0.00'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Clock3 className="h-4.5 w-4.5" />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Pending requests
          </p>

          <p className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:col-span-2 xl:col-span-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CheckCircle2 className="h-4.5 w-4.5" />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Total paid out
          </p>

          <p className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">
            {formatMoney(totalWithdrawn)}
          </p>
        </div>
      </section>

      {/* Withdrawal information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#0F766E]">
            <Clock3 className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[#0F172A]">
              Weekly withdrawal window
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Requests can be submitted every Thursday
              between 9:00 AM and 5:00 PM.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-400">
              Minimum
            </p>

            <p className="mt-0.5 text-sm font-semibold text-slate-700">
              $10.00
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-400">
              Admin fee
            </p>

            <p className="mt-0.5 text-sm font-semibold text-slate-700">
              10%
            </p>
          </div>
        </div>
      </section>

      {/* History */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            Withdrawal History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track your withdrawal requests and payouts.
          </p>
        </div>

        {withdrawals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
              <Wallet className="h-6 w-6 text-slate-300" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#0F172A]">
              No withdrawals yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your withdrawal requests will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Amount
                      </th>

                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Destination
                      </th>

                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Fee
                      </th>

                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Net payout
                      </th>

                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Status
                      </th>

                      <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {withdrawals.map((withdrawal) => (
                      <tr
                        key={withdrawal.id}
                        onClick={() =>
                          setSelectedWithdrawal(
                            withdrawal,
                          )
                        }
                        className="cursor-pointer transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-[#0F172A]">
                            {formatMoney(
                              withdrawal.amount,
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {withdrawal.destination_network}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {shortenAddress(
                              withdrawal.destination_address,
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatMoney(
                            withdrawal.admin_fee,
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-[#0F766E]">
                          {formatMoney(
                            withdrawal.net_amount,
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={withdrawal.status}
                          />
                        </td>

                        <td className="px-5 py-4 text-right text-xs text-slate-500">
                          {formatDate(
                            withdrawal.requested_at,
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile */}
            <div className="grid gap-3 md:hidden">
              {withdrawals.map((withdrawal) => (
                <WithdrawalCard
                  key={withdrawal.id}
                  withdrawal={withdrawal}
                  onView={setSelectedWithdrawal}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {showRequestModal && wallet && accessToken && (
        <RequestWithdrawalModal
          wallet={wallet}
          token={accessToken}
          onClose={() =>
            setShowRequestModal(false)
          }
          onSuccess={() => {
            void loadData()
          }}
        />
      )}

      {selectedWithdrawal && (
        <WithdrawalDetailsModal
          withdrawal={selectedWithdrawal}
          onClose={() =>
            setSelectedWithdrawal(null)
          }
        />
      )}
    </div>
  )
}