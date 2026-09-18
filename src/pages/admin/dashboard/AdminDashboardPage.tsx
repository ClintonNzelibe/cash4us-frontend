import {
  
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Users,
  Wallet,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import PageLoader from '../../../components/ui/PageLoader'
import Button from '../../../components/ui/Button'

import { useAuth } from '../../../context/AuthContext'
import { getAdminDashboard } from '../../../services/adminDashboardService'
import type { AdminDashboardData } from '../../../types/admin/dashboard'

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  iconClassName = 'bg-emerald-50 text-[#0F766E]',
}: {
  title: string
  value: number
  icon: typeof Users
  description: string
  iconClassName?: string
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value.toLocaleString()}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </Card>
  )
}

function SectionHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-bold text-slate-900">
        {title}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  )
}

export default function AdminDashboardPage() {
  const { accessToken } = useAuth()

  const [data, setData] = useState<AdminDashboardData | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const loadDashboard = useCallback(
    async (isRefresh = false) => {
      if (!accessToken) return

      try {
        setError('')

        if (isRefresh) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        const response = await getAdminDashboard(accessToken)
        setData(response)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load admin dashboard.',
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [accessToken],
  )

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  if (loading) {
    return <PageLoader />
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-7xl">
        <Card className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <XCircle size={24} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Unable to load dashboard
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            {error ||
              'The administrator dashboard could not be loaded.'}
          </p>

          <Button
            className="mt-5"
            onClick={() => loadDashboard()}
          >
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#0F766E]">
            Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor members, payments, withdrawals, cycles and task activity.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => loadDashboard(true)}
          disabled={refreshing}
          className="h-11"
        >
          <RefreshCw
            size={16}
            className={`mr-2 ${refreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Members"
          value={data.members.total}
          icon={Users}
          description={`${data.members.active.toLocaleString()} active members`}
        />

        <StatCard
          title="Active Cycles"
          value={data.cycles.active}
          icon={RefreshCw}
          description={`${data.cycles.completed.toLocaleString()} completed cycles`}
          iconClassName="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Pending Payments"
          value={data.payments.pending}
          icon={CreditCard}
          description={`${data.payments.approved.toLocaleString()} approved`}
          iconClassName="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Pending Withdrawals"
          value={data.withdrawals.pending}
          icon={Wallet}
          description={`${data.withdrawals.paid.toLocaleString()} paid`}
          iconClassName="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <SectionHeader
            title="Payments"
            description="Current payment processing status"
          />

          <div className="space-y-3">
            <StatusRow
              label="Pending"
              value={data.payments.pending}
              variant="warning"
            />

            <StatusRow
              label="Approved"
              value={data.payments.approved}
              variant="success"
            />

            <StatusRow
              label="Rejected"
              value={data.payments.rejected}
              variant="danger"
            />
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader
            title="Withdrawals"
            description="Current withdrawal processing status"
          />

          <div className="space-y-3">
            <StatusRow
              label="Pending"
              value={data.withdrawals.pending}
              variant="warning"
            />

            <StatusRow
              label="Approved"
              value={data.withdrawals.approved}
              variant="success"
            />

            <StatusRow
              label="Paid"
              value={data.withdrawals.paid}
              variant="success"
            />

            <StatusRow
              label="Rejected"
              value={data.withdrawals.rejected}
              variant="danger"
            />
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader
            title="Task Reviews"
            description="Daily task submission activity"
          />

          <div className="space-y-3">
            <StatusRow
              label="Pending Reviews"
              value={data.tasks.pending_reviews}
              variant="warning"
            />

            <StatusRow
              label="Completed"
              value={data.tasks.completed}
              variant="success"
            />

            <StatusRow
              label="Rejected"
              value={data.tasks.rejected}
              variant="danger"
            />
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">
            Quick Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Key operational figures from the Cash4Us platform.
          </p>
        </div>

        <div className="grid divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          <OverviewItem
            icon={Users}
            label="Active Members"
            value={data.members.active}
          />

          <OverviewItem
            icon={ArrowUpRight}
            label="Completed Cycles"
            value={data.cycles.completed}
          />

          <OverviewItem
            icon={CheckCircle2}
            label="Approved Payments"
            value={data.payments.approved}
          />

          <OverviewItem
            icon={ClipboardCheck}
            label="Completed Tasks"
            value={data.tasks.completed}
          />
        </div>
      </Card>
    </div>
  )
}

function StatusRow({
  label,
  value,
  variant,
}: {
  label: string
  value: number
  variant: 'success' | 'warning' | 'danger'
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-700">
        {label}
      </span>

      <Badge variant={variant}>
        {value.toLocaleString()}
      </Badge>
    </div>
  )
}

function OverviewItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: number
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#0F766E]">
        <Icon size={19} />
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500">
          {label}
        </p>
        <p className="mt-1 text-lg font-bold text-slate-900">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  )
}