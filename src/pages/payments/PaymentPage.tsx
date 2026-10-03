import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clipboard,
  Clock3,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  WalletCards,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import {
  getPayment,
  getPayments,
  cancelPayment,
  submitPayment,
} from '../../services/paymentService'
import type { Payment } from '../../types/payment'

interface PaymentState {
  packageId: string
  packageName: string
  tenureId: string
  durationDays: number
  installmentNumber?: number
}

const POLL_INTERVAL_MS = 15_000

function formatRemainingTime(
  expiresAt: string | null | undefined,
  now: number,
) {
  if (!expiresAt || !now) return null

  const milliseconds = new Date(expiresAt).getTime() - now
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return 'Expired'

  const totalSeconds = Math.ceil(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${hours}h ${minutes}m ${seconds}s`
}

function statusPresentation(payment: Payment, isExpired: boolean) {
  if (payment.status === 'APPROVED') {
    return {
      label: 'Approved',
      message: 'Your payment has been verified and your package is active.',
      styles: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    }
  }

  if (payment.status === 'REJECTED') {
    return {
      label: 'Rejected',
      message: payment.verification_error || 'This payment could not be verified.',
      styles: 'border-rose-200 bg-rose-50 text-rose-800',
    }
  }

  if (payment.verification_error) {
    return {
      label: 'Verification needs attention',
      message: payment.verification_error,
      styles: 'border-amber-200 bg-amber-50 text-amber-800',
    }
  }

  if (isExpired) {
    return {
      label: 'Payment window expired',
      message: 'Do not send funds to this address. Create a new payment when available.',
      styles: 'border-amber-200 bg-amber-50 text-amber-800',
    }
  }

  return {
    label: 'Pending verification',
    message: 'This page updates after Cash4Us independently verifies the blockchain transaction.',
    styles: 'border-sky-200 bg-sky-50 text-sky-800',
  }
}

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as PaymentState | null
  const { accessToken, isLoading: isAuthLoading } = useAuth()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [now, setNow] = useState(0)
  const currentPaymentId = payment?.id

  const loadActivePayment = useCallback(async (showAnyPending = false) => {
    if (!accessToken) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Detail fields are authoritative for the deposit instructions.
      const payments = await getPayments(accessToken)
      const pendingPayments = payments.filter(
        (candidate) => candidate.status === 'PENDING',
      )
      const pendingPayment = state && !showAnyPending
        ? pendingPayments.find(
            (candidate) =>
              candidate.package === state.packageId &&
              candidate.tenure === state.tenureId,
          )
        : pendingPayments[0]

      if (!pendingPayment) {
        setPayment(null)

        if (state && pendingPayments.length > 0) {
          setError(
            'You have a pending payment for a different package or tenure. Do not send funds to it for this selection.',
          )
        }

        return
      }

      setPayment(await getPayment(pendingPayment.id, accessToken))
    } catch (requestError) {
      setPayment(null)
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to retrieve your payment status. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, state])

  const refreshCurrentPayment = useCallback(async () => {
    if (!accessToken || !currentPaymentId) return

    setIsLoading(true)
    setError(null)

    try {
      setPayment(await getPayment(currentPaymentId, accessToken))
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to retrieve your payment status. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, currentPaymentId])

  useEffect(() => {
    if (isAuthLoading) return

    const initialRequest = window.setTimeout(
      () => void loadActivePayment(),
      0,
    )

    return () => window.clearTimeout(initialRequest)
  }, [isAuthLoading, loadActivePayment])

  useEffect(() => {
    const updateTime = () => setNow(Date.now())
    const initialUpdate = window.setTimeout(updateTime, 0)
    const timer = window.setInterval(updateTime, 1000)

    return () => {
      window.clearTimeout(initialUpdate)
      window.clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    if (!accessToken || payment?.status !== 'PENDING') return

    const poller = window.setInterval(
      () => void refreshCurrentPayment(),
      POLL_INTERVAL_MS,
    )

    return () => window.clearInterval(poller)
  }, [accessToken, payment?.status, refreshCurrentPayment])

  const remainingTime = useMemo(
    () => formatRemainingTime(payment?.verification_expires_at, now),
    [now, payment?.verification_expires_at],
  )
  const isExpired = remainingTime === 'Expired'
  const status = payment && statusPresentation(payment, isExpired)

  const createPayment = async () => {
    if (!accessToken || !state || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      const createdPayment = await submitPayment(
        {
          package: state.packageId,
          tenure: state.tenureId,
          installment_number: state.installmentNumber ?? 1,
          payment_network: 'BEP20',
        },
        accessToken,
      )

      setPayment(createdPayment)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to create your payment. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyDepositAddress = async () => {
    if (!payment?.deposit_address) return

    if (!navigator.clipboard) {
      setError('Unable to copy the deposit address. Please copy it manually.')
      return
    }

    try {
      await navigator.clipboard.writeText(payment.deposit_address)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2_000)
    } catch {
      setError('Unable to copy the deposit address. Please copy it manually.')
    }
  }

  const cancelAndChangePackage = async () => {
    if (
      !payment ||
      payment.status !== 'PENDING' ||
      !accessToken ||
      isCancelling
    ) {
      return
    }

    const confirmed = window.confirm(
      'Cancel this pending payment? Its address and reference will be retained for audit, and you must not send funds to it. You can then choose another package or tenure.',
    )

    if (!confirmed) return

    setIsCancelling(true)
    setError(null)

    try {
      await cancelPayment(payment.id, accessToken)
      setPayment(null)
      navigate('/packages')
    } catch (cancellationError) {
      setError(
        cancellationError instanceof Error
          ? cancellationError.message
          : 'Unable to cancel this payment. Please try again.',
      )
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-[#0F766E]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0F766E]">
            USDT payment
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            Complete your BEP20 payment
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Send only the exact server-calculated USDT amount shown below.
            Your package is activated only after Cash4Us verifies the transaction.
          </p>
        </div>

        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
            <LoaderCircle className="mr-3 h-5 w-5 animate-spin text-[#0F766E]" />
            Loading your secure payment details…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800 shadow-sm">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <div>
                <h2 className="font-bold">Payment request unavailable</h2>
                <p className="mt-1 text-sm leading-6">{error}</p>
                <button
                  type="button"
                  onClick={() => void loadActivePayment(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800"
                >
                  <RefreshCw className="h-4 w-4" />
                  Check active payment
                </button>
              </div>
            </div>
          </div>
        ) : !payment ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <WalletCards className="mx-auto h-10 w-10 text-[#0F766E]" />
            <h2 className="mt-4 text-xl font-bold text-[#0F172A]">
              Create your secure BEP20 payment
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Cash4Us will calculate the amount and assign a unique deposit address.
              Do not send USDT until those instructions are displayed.
            </p>
            {state ? (
              <button
                type="button"
                disabled={isSubmitting || !accessToken}
                onClick={() => void createPayment()}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <WalletCards className="h-4 w-4" />
                )}
                {isSubmitting ? 'Creating payment…' : 'Get payment instructions'}
              </button>
            ) : (
              <button
                onClick={() => navigate('/packages')}
                className="mt-6 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#115E59]"
              >
                Back to packages
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <section className="space-y-6">
              <div className={`rounded-2xl border p-5 shadow-sm ${status?.styles}`}>
                <div className="flex items-start gap-3">
                  {payment.status === 'APPROVED' ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  ) : (
                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0" />
                  )}
                  <div>
                    <h2 className="font-bold">{status?.label}</h2>
                    <p className="mt-1 text-sm leading-6">{status?.message}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0F766E]">
                    <WalletCards className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#0F172A]">Send USDT on BEP20</h2>
                    <p className="text-sm text-slate-500">Use BNB Smart Chain only.</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-500">Amount to pay</p>
                    <p className="mt-1 text-2xl font-bold text-[#0F766E]">
                      {payment.expected_amount ?? 'Unavailable'} USDT
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-500">Network</p>
                    <p className="mt-1 text-lg font-bold text-[#0F172A]">BEP20</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Assigned deposit address
                  </p>
                  {payment.deposit_address ? (
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <code className="min-w-0 flex-1 break-all rounded-lg bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-800">
                        {payment.deposit_address}
                      </code>
                      <button
                        type="button"
                        onClick={() => void copyDepositAddress()}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#0F766E] px-4 py-3 text-sm font-semibold text-[#0F766E] hover:bg-[#F0FDFA]"
                      >
                        <Clipboard className="h-4 w-4" />
                        {copied ? 'Copied' : 'Copy address'}
                      </button>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-rose-700">
                      The server did not provide a deposit address. Do not send funds.
                    </p>
                  )}
                </div>

                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  <div className="flex gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                    <p>
                      Send the <strong>exact amount</strong> to this address using
                      <strong> BEP20</strong>. A different token, network, or amount
                      may prevent verification.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="text-sm leading-6 text-emerald-800">
                    Do not mark this payment as complete yourself. Cash4Us verifies
                    the detected transaction independently before activating your package.
                  </p>
                </div>
              </div>
            </section>

            <aside>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
                <h2 className="text-base font-bold text-[#0F172A]">Order summary</h2>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">Selected package</p>
                  <p className="mt-1 text-lg font-bold text-[#0F172A]">
                    {payment.package_name || state?.packageName || 'Selected package'}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                    <span className="text-sm text-slate-500">Tenure</span>
                    <span className="text-sm font-semibold text-[#0F172A]">
                      {payment.tenure_days ?? state?.durationDays ?? '—'}
                      {typeof (payment.tenure_days ?? state?.durationDays) === 'number'
                        ? ' days'
                        : ''}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Installment</span>
                    <span className="text-base font-semibold text-[#0F172A]">
                      #{payment.installment_number ?? '—'}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <p className="text-xs font-medium text-slate-500">Payment reference</p>
                    <p className="mt-1 break-all text-sm font-semibold text-[#0F172A]">
                      {payment.transaction_reference || payment.id}
                    </p>
                  </div>
                </div>

                {payment.verification_expires_at && (
                  <div className="mt-5 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-500">Payment window</p>
                    <p className={`mt-1 text-lg font-bold ${isExpired ? 'text-rose-700' : 'text-[#0F172A]'}`}>
                      {remainingTime}
                    </p>
                  </div>
                )}

                {payment.blockchain_tx_hash && (
                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <p className="text-xs font-medium text-slate-500">Verified transaction</p>
                    <p className="mt-1 break-all text-xs font-semibold text-slate-700">
                      {payment.blockchain_tx_hash}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => void refreshCurrentPayment()}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh status
                </button>

                {payment.status === 'PENDING' && (
                  <button
                    type="button"
                    disabled={isCancelling}
                    onClick={() => void cancelAndChangePackage()}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-300 px-5 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isCancelling
                      ? 'Cancelling payment…'
                      : 'Cancel payment / Change package'}
                  </button>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
