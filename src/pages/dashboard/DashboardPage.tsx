import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  
  Gift,
  HandCoins,
  ListChecks,
  Package,
  
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
  XCircle,
  Zap,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { getDashboardData } from '../../services/dashboardService'
import type { DashboardData } from '../../types/dashboard'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import Spinner from '../../components/ui/Spinner'

export default function DashboardPage() {
  const { user, accessToken } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboard = useCallback(async () => {
    if (!accessToken) return

    try {
      setIsLoading(true)
      setError(null)

      const dashboard = await getDashboardData(accessToken)
      setData(dashboard)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load your dashboard.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [accessToken])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const referralTotal = useMemo(() => {
    if (!data) return 0

    return data.referrals.reduce(
      (total, referral) =>
        total + Number(referral.bonus_amount || 0),
      0,
    )
  }, [data])

  const completedTasks = data?.tasks.tasks_completed ?? 0
  const taskCompletionRate =
    data?.tasks.overall_completion_rate ?? 0

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <XCircle size={28} />
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Unable to load your dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error || 'Something went wrong while loading your account.'}
          </p>

          <button
            onClick={loadDashboard}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#0F766E] px-6 text-sm font-semibold text-white transition hover:bg-[#115E59]"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6 pb-10">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0B1F33] px-6 py-7 text-white shadow-sm sm:px-8 sm:py-8">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
            <Sparkles size={14} />
            Member Dashboard
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back, {user?.first_name || 'Member'} 👋
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Here's a quick overview of your Cash4Us account,
            earnings and daily activity.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/packages')}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#22C55E] px-5 text-sm font-semibold text-white transition hover:bg-[#16A34A]"
            >
              <Package size={17} />
              Explore Packages
            </button>

            <button
              onClick={() => navigate('/tasks')}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <ListChecks size={17} />
              View Tasks
            </button>
          </div>
        </div>

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#0F766E]/40 blur-3xl" />
        <div className="absolute -bottom-28 right-20 h-64 w-64 rounded-full bg-[#22C55E]/20 blur-3xl" />

        <div className="absolute right-8 top-8 hidden h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 lg:flex">
          <TrendingUp size={34} className="text-emerald-300" />
        </div>
      </section>

      {/* Main balance + package */}
      <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        {/* Wallet */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F766E] to-[#115E59] p-6 text-white shadow-sm sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-100">
                <Wallet size={18} />
                Available Balance
              </div>

              <p className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {formatCurrency(data.wallet.available_balance)}
              </p>

              <p className="mt-2 text-sm text-emerald-100/80">
                Ready for eligible withdrawals
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
              <HandCoins size={22} />
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-xs text-emerald-100/70">
                Total Balance
              </p>
              <p className="mt-1 text-lg font-bold">
                {formatCurrency(data.wallet.balance)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <p className="text-xs text-emerald-100/70">
                Pending
              </p>
              <p className="mt-1 text-lg font-bold">
                {formatCurrency(data.wallet.pending_balance)}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/wallet')}
            className="mt-4 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15"
          >
            Open My Wallet
            <ChevronRight size={17} />
          </button>
        </div>

        {/* Active package */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-[#0F766E]">
                Membership
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {data.activePackage
                  ? data.activePackage.name
                  : 'No Active Package'}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-[#0F766E]">
              <Package size={21} />
            </div>
          </div>

          {data.activePackage ? (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Package status
                </span>
                <span className="font-semibold text-emerald-600">
                  Active
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-3/5 rounded-full bg-[#0F766E]" />
              </div>

              <button
                onClick={() => navigate('/packages/my')}
                className="mt-6 flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-[#0F766E]"
              >
                View Package
                <ChevronRight size={17} />
              </button>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-slate-50 p-5">
              <p className="text-sm leading-6 text-slate-500">
                You don't currently have an active cycle.
                Choose a package to get started.
              </p>

              <button
                onClick={() => navigate('/packages')}
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0F766E] hover:text-[#115E59]"
              >
                Browse packages
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={<HandCoins size={21} />}
          label="Referral Earnings"
          value={formatCurrency(referralTotal)}
          subtitle={`${data.referrals.length} referral${data.referrals.length === 1 ? '' : 's'}`}
          iconClass="bg-emerald-50 text-[#0F766E]"
        />

        <Stat
          icon={<CheckCircle2 size={21} />}
          label="Tasks Completed"
          value={String(completedTasks)}
          subtitle={`${taskCompletionRate}% completion rate`}
          iconClass="bg-blue-50 text-blue-600"
        />

        <Stat
          icon={<Zap size={21} />}
          label="Task Streak"
          value={`${data.tasks.daily_task_streak}`}
          subtitle="Current daily streak"
          iconClass="bg-amber-50 text-amber-600"
        />

        <Stat
          icon={<Users size={21} />}
          label="Referrals"
          value={String(data.referrals.length)}
          subtitle="People in your network"
          iconClass="bg-violet-50 text-violet-600"
        />
      </section>

      {/* Tasks + Notifications */}
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardPanel
          title="Daily Tasks"
          subtitle="Your latest task activity"
          icon={<ListChecks size={20} />}
          action="View all"
          onAction={() => navigate('/tasks')}
        >
          <div className="grid grid-cols-3 gap-3">
            <ActivityStat
              icon={<CheckCircle2 size={17} />}
              value={data.tasks.tasks_completed}
              label="Completed"
              className="text-emerald-600"
            />

            <ActivityStat
              icon={<XCircle size={17} />}
              value={data.tasks.tasks_missed}
              label="Missed"
              className="text-red-500"
            />

            <ActivityStat
              icon={<Zap size={17} />}
              value={data.tasks.daily_task_streak}
              label="Streak"
              className="text-amber-500"
            />
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Completion rate
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {data.tasks.tasks_assigned} tasks assigned
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-[#0F766E]">
                {taskCompletionRate}%
              </p>
              <p className="text-xs text-slate-400">
                overall
              </p>
            </div>
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="Notifications"
          subtitle="Latest updates from Cash4Us"
          icon={<Bell size={20} />}
          action="View all"
          onAction={() => navigate('/notifications')}
        >
          {data.notifications.length > 0 ? (
            <div className="space-y-3">
              {data.notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className="flex gap-3 rounded-2xl bg-slate-50 p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm">
                    <Bell size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {notification.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-[11px] text-slate-400">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyPanel
              icon={<Bell size={22} />}
              title="No notifications yet"
              text="You're all caught up."
            />
          )}
        </DashboardPanel>
      </section>

      {/* Transactions */}
      <DashboardPanel
        title="Recent Transactions"
        subtitle="Your latest wallet activity"
        icon={<ArrowUpRight size={20} />}
        action="View all"
        onAction={() => navigate('/transactions')}
      >
        {data.transactions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {data.transactions.slice(0, 5).map((transaction) => {
              const isCredit = transaction.direction === 'CREDIT'

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isCredit
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-500'
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownRight size={18} />
                      ) : (
                        <ArrowUpRight size={18} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {transaction.transaction_type_display}
                      </p>
                     <p className="mt-1 truncate text-xs text-slate-400">
                        {transaction.reference || 'Wallet transaction'}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p
                      className={`text-sm font-bold ${
                        isCredit
                          ? 'text-emerald-600'
                          : 'text-red-500'
                      }`}
                    >
                      {isCredit ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <EmptyPanel
            icon={<ArrowUpRight size={22} />}
            title="No transactions yet"
            text="Your wallet activity will appear here."
          />
        )}
      </DashboardPanel>

      {/* Quick actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Quick Actions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Jump straight to what you need.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <QuickAction
            icon={<Package size={21} />}
            title="Explore Packages"
            description="View available membership packages."
            onClick={() => navigate('/packages')}
          />

          <QuickAction
            icon={<Target size={21} />}
            title="Complete Tasks"
            description="Check today's available tasks."
            onClick={() => navigate('/tasks')}
          />

          <QuickAction
            icon={<Gift size={21} />}
            title="Invite Friends"
            description="Grow your referral network."
            onClick={() => navigate('/referrals')}
          />
        </div>
      </section>
    </div>
  )
}

/* ----------------------------- Components ----------------------------- */

function Stat({
  icon,
  label,
  value,
  subtitle,
  iconClass,
}: {
  icon: React.ReactNode
  label: string
  value: string
  subtitle: string
  iconClass: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

function DashboardPanel({
  title,
  subtitle,
  icon,
  action,
  onAction,
  children,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
  action?: string
  onAction?: () => void
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#0F766E]">
            {icon}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
              {title}
            </h2>
            <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">
              {subtitle}
            </p>
          </div>
        </div>

        {action && onAction && (
          <button
            onClick={onAction}
            className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#0F766E] transition hover:text-[#115E59] sm:text-sm"
          >
            {action}
            <ChevronRight size={15} />
          </button>
        )}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}

function ActivityStat({
  icon,
  value,
  label,
  className,
}: {
  icon: React.ReactNode
  value: number
  label: string
  className: string
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 text-center">
      <div className={`flex justify-center ${className}`}>
        {icon}
      </div>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {label}
      </p>
    </div>
  )
}

function EmptyPanel({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="flex min-h-[150px] flex-col items-center justify-center rounded-2xl bg-slate-50 px-5 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
        {icon}
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {text}
      </p>
    </div>
  )
}

function QuickAction({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#0F766E] transition group-hover:bg-[#0F766E] group-hover:text-white">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <ChevronRight
        size={18}
        className="shrink-0 text-slate-300 transition group-hover:text-[#0F766E]"
      />
    </button>
  )
}