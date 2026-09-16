import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  WalletCards,
} from 'lucide-react'
import { useState } from 'react'

type PaymentMethod = 'usdt' | 'card' | 'bank_transfer'

interface PaymentState {
  packageId: string
  packageName: string
  packageAmount: string | number
  tenureId: string
  durationDays: number
}

const paymentMethods = [
  {
    id: 'usdt' as const,
    title: 'USDT (Crypto)',
    subtitle: 'Pay with USDT through NOWPayments',
    icon: WalletCards,
    badge: 'Crypto',
  },
  {
    id: 'card' as const,
    title: 'Card Payment',
    subtitle: 'Pay securely with your debit or credit card',
    icon: CreditCard,
    badge: 'Remita',
  },
  {
    id: 'bank_transfer' as const,
    title: 'Bank Transfer',
    subtitle: 'Make a bank transfer through Remita',
    icon: Building2,
    badge: 'Remita',
  },
]

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const state = location.state as PaymentState | null

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod | null>(null)

  if (!state) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-4 py-12">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#0F172A]">
            Payment information unavailable
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Please select a package and tenure again before continuing.
          </p>

          <button
            onClick={() => navigate('/packages')}
            className="mt-6 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59]"
          >
            Back to Packages
          </button>
        </div>
      </div>
    )
  }

  const amount = Number(state.packageAmount)

  const handleContinue = () => {
    if (!paymentMethod) return

    /*
     * Gateway integrations will be connected here:
     *
     * USDT          -> NOWPayments
     * Card Payment  -> Remita
     * Bank Transfer -> Remita
     *
     * Do not activate the package from the frontend.
     * Activation must happen after backend confirmation.
     */

    console.log('Selected payment method:', paymentMethod)

    navigate('/packages', {
      state: {
        paymentMethod,
        paymentState: state,
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-[#0F766E]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#0F766E]">
            Secure Checkout
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl">
            Choose your payment method
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Select how you would like to complete your payment.
            Your package will only be activated after the payment
            is successfully verified.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* Payment methods */}
          <div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-base font-bold text-[#0F172A]">
                  Payment method
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose one of the available payment options.
                </p>
              </div>

              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  const selected = paymentMethod === method.id

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        selected
                          ? 'border-[#0F766E] bg-[#F0FDFA] ring-1 ring-[#0F766E]'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                          selected
                            ? 'bg-[#0F766E] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-[#0F172A]">
                            {method.title}
                          </h3>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              selected
                                ? 'bg-white text-[#0F766E]'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {method.badge}
                          </span>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {method.subtitle}
                        </p>
                      </div>

                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? 'border-[#0F766E] bg-[#0F766E]'
                            : 'border-slate-300'
                        }`}
                      >
                        {selected && (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Selected method information */}
              {paymentMethod && (
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  {paymentMethod === 'usdt' && (
                    <>
                      <h3 className="text-sm font-semibold text-[#0F172A]">
                        USDT payment
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        You will be redirected to the secure NOWPayments
                        checkout once the gateway integration is enabled.
                      </p>
                    </>
                  )}

                  {paymentMethod === 'card' && (
                    <>
                      <h3 className="text-sm font-semibold text-[#0F172A]">
                        Card payment
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        You will be redirected to the secure Remita
                        payment page to complete your card payment.
                      </p>
                    </>
                  )}

                  {paymentMethod === 'bank_transfer' && (
                    <>
                      <h3 className="text-sm font-semibold text-[#0F172A]">
                        Bank transfer
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Remita will provide the required bank transfer
                        details for completing your payment.
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Security */}
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-xs font-semibold text-emerald-800">
                    Secure payment
                  </p>
                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    Payment confirmation is handled securely by the
                    payment provider and verified by Cash4Us before
                    your package is activated.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <aside>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-base font-bold text-[#0F172A]">
                Order summary
              </h2>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Selected package
                </p>

                <p className="mt-1 text-lg font-bold text-[#0F172A]">
                  {state.packageName}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-sm text-slate-500">
                    Tenure
                  </span>

                  <span className="text-sm font-semibold text-[#0F172A]">
                    {state.durationDays} days
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Payment amount
                  </span>

                  <span className="text-base font-semibold text-[#0F172A]">
                    ${amount.toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#0F172A]">
                      Total
                    </span>

                    <span className="text-xl font-bold text-[#0F766E]">
                      ${amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!paymentMethod}
                onClick={handleContinue}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to Payment
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="mt-3 text-center text-[11px] leading-4 text-slate-400">
                Package activation occurs only after successful
                payment verification.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}