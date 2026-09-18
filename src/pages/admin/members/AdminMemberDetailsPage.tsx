import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  Mail,
  Package,
  RefreshCw,
  ShieldCheck,
  User,
  UserCheck,
  UserX,
  Wallet,
  Users,
  XCircle,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import EmptyState from '../../../components/ui/EmptyState'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'
import {
  getAdminMember,
  updateAdminMemberStatus,
} from '../../../services/adminMemberService'

import type { AdminMember } from '../../../types/admin/members'

export default function AdminMemberDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [member, setMember] =
    useState<AdminMember | null>(null)

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const loadMember = useCallback(
    async (refresh = false) => {
      if (!accessToken || !id) return

      try {
        setError('')

        if (refresh) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        const response = await getAdminMember(
          id,
          accessToken,
        )

        setMember(response)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load member.',
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [accessToken, id],
  )

  useEffect(() => {
    loadMember()
  }, [loadMember])

  async function handleStatusChange() {
    if (!accessToken || !member || updating) {
      return
    }

    const nextStatus = !member.is_active

    const confirmed = window.confirm(
      nextStatus
        ? `Activate ${member.email}?`
        : `Deactivate ${member.email}?`,
    )

    if (!confirmed) return

    try {
      setUpdating(true)
      setError('')

      await updateAdminMemberStatus(
        member.id,
        nextStatus,
        accessToken,
      )

      setMember((current) =>
        current
          ? {
              ...current,
              is_active: nextStatus,
            }
          : current,
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update member status.',
      )
    } finally {
      setUpdating(false)
    }
  }

  async function copyValue(
    value: string,
    label: string,
  ) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)

      window.setTimeout(() => {
        setCopied('')
      }, 1800)
    } catch {
      setError('Unable to copy value.')
    }
  }

  if (loading) {
    return <PageLoader />
  }

  if (error && !member) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card className="p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <XCircle size={24} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Unable to load member
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <div className="mt-5 flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/members')}
            >
              Back to Members
            </Button>

            <Button onClick={() => loadMember()}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!member) {
    return (
      <EmptyState
        title="Member not found"
        description="The requested member could not be found."
      />
    )
  }

  const fullName =
    `${member.first_name} ${member.last_name}`.trim()

  const walletBalance = Number(
    member.wallet?.balance ?? 0,
  )

  const availableBalance = Number(
    member.wallet?.available_balance ?? 0,
  )

  const pendingBalance = Number(
    member.wallet?.pending_balance ?? 0,
  )

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Top */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => navigate('/admin/members')}
          className="flex w-fit items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0F766E]"
        >
          <ArrowLeft size={17} />
          Back to Members
        </button>

        <Button
          variant="outline"
          onClick={() => loadMember(true)}
          disabled={refreshing}
          className="h-11"
        >
          <RefreshCw
            size={16}
            className={`mr-2 ${
              refreshing ? 'animate-spin' : ''
            }`}
          />
          Refresh
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Member hero */}
      <Card className="overflow-hidden">
        <div className="bg-[#0F766E] px-5 py-7 text-white sm:px-7">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold">
                {getInitials(
                  member.first_name,
                  member.last_name,
                  member.username,
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {fullName || member.username}
                  </h1>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      member.is_active
                        ? 'bg-white/15 text-white'
                        : 'bg-red-500/20 text-red-100'
                    }`}
                  >
                    {member.is_active
                      ? 'Active'
                      : 'Inactive'}
                  </span>
                </div>

                <p className="mt-1 text-sm text-emerald-50">
                  @{member.username}
                </p>

                <p className="mt-1 text-sm text-emerald-100">
                  Member since{' '}
                  {formatDate(member.date_joined)}
                </p>
              </div>
            </div>

            <Button
              variant={
                member.is_active
                  ? 'danger'
                  : 'secondary'
              }
              onClick={handleStatusChange}
              disabled={updating}
              className="h-11 bg-white/10"
            >
              {member.is_active ? (
                <>
                  <UserX size={16} className="mr-2" />
                  {updating
                    ? 'Updating...'
                    : 'Deactivate Member'}
                </>
              ) : (
                <>
                  <UserCheck
                    size={16}
                    className="mr-2"
                  />
                  {updating
                    ? 'Updating...'
                    : 'Activate Member'}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          <ContactItem
            icon={Mail}
            label="Email"
            value={member.email}
            copyable
            copied={copied === 'email'}
            onCopy={() =>
              copyValue(member.email, 'email')
            }
          />

          <ContactItem
            icon={ShieldCheck}
            label="Membership Code"
            value={member.membership_code || '—'}
            copyable={Boolean(member.membership_code)}
            copied={copied === 'membership'}
            onCopy={() =>
              copyValue(
                member.membership_code,
                'membership',
              )
            }
          />

          <ContactItem
            icon={Users}
            label="Referral Code"
            value={member.referral_code || '—'}
            copyable={Boolean(member.referral_code)}
            copied={copied === 'referral'}
            onCopy={() =>
              copyValue(
                member.referral_code,
                'referral',
              )
            }
          />

          <ContactItem
            icon={CalendarDays}
            label="Joined"
            value={formatDate(member.date_joined)}
          />
        </div>
      </Card>

      {/* Financial overview */}
      <div>
        <SectionTitle
          title="Wallet Overview"
          description="Current wallet balances for this member."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <FinancialCard
            title="Total Balance"
            value={walletBalance}
            icon={Wallet}
            iconClassName="bg-emerald-50 text-[#0F766E]"
          />

          <FinancialCard
            title="Available Balance"
            value={availableBalance}
            icon={CheckCircle2}
            iconClassName="bg-blue-50 text-blue-600"
          />

          <FinancialCard
            title="Pending Balance"
            value={pendingBalance}
            icon={Clock3}
            iconClassName="bg-amber-50 text-amber-600"
          />
        </div>
      </div>

      {/* Main information */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current cycle */}
        <Card className="p-5">
          <SectionTitle
            title="Current Cycle"
            description="Member's current package cycle."
          />

          {member.current_cycle ? (
            <div className="space-y-4">
              <DetailRow
                label="Package"
                value={
                  member.current_cycle.package ||
                  '—'
                }
                icon={Package}
              />

              <DetailRow
                label="Tenure"
                value={`${member.current_cycle.tenure_days} days`}
                icon={CalendarDays}
              />

              <DetailRow
                label="Started"
                value={formatDateTime(
                  member.current_cycle.started_at,
                )}
                icon={Clock3}
              />

              <DetailRow
                label="Ends"
                value={formatDateTime(
                  member.current_cycle.ends_at,
                )}
                icon={CalendarDays}
              />

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm text-slate-500">
                  Status
                </span>

                <Badge
                  variant={getStatusVariant(
                    member.current_cycle.status,
                  )}
                >
                  {formatStatus(
                    member.current_cycle.status,
                  )}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Total Bonus Earned
                </span>

                <span className="text-sm font-bold text-slate-900">
                  ₦
                  {Number(
                    member.current_cycle
                      .total_bonus_earned ?? 0,
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No active cycle"
              description="This member currently has no cycle information."
            />
          )}
        </Card>

        {/* Referrals */}
        <Card className="p-5">
          <SectionTitle
            title="Referral Overview"
            description="Referral activity associated with this member."
          />

          <div className="grid grid-cols-3 gap-3">
            <MiniStat
              label="Total"
              value={member.referrals?.total ?? 0}
            />

            <MiniStat
              label="Paid"
              value={member.referrals?.paid ?? 0}
            />

            <MiniStat
              label="Pending"
              value={
                member.referrals?.pending ?? 0
              }
            />
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#0F766E]">
                <Users size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Referral Code
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {member.referral_code || 'No referral code'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Task statistics */}
      <Card className="p-5">
        <SectionTitle
          title="Task Statistics"
          description="Task statistics returned by the Cash4Us task statistics service."
        />

        <TaskStatistics
          statistics={member.task_statistics}
        />
      </Card>

      {/* Account information */}
      <Card className="p-5">
        <SectionTitle
          title="Account Information"
          description="Basic account information."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <DetailRow
            label="First Name"
            value={member.first_name || '—'}
            icon={User}
          />

          <DetailRow
            label="Last Name"
            value={member.last_name || '—'}
            icon={User}
          />

          <DetailRow
            label="Username"
            value={member.username}
            icon={User}
          />

          <DetailRow
            label="Email"
            value={member.email}
            icon={Mail}
          />

          <DetailRow
            label="Membership Code"
            value={member.membership_code || '—'}
            icon={ShieldCheck}
          />

          <DetailRow
            label="Account Status"
            value={
              member.is_active
                ? 'Active'
                : 'Inactive'
            }
            icon={
              member.is_active
                ? UserCheck
                : UserX
            }
          />
        </div>
      </Card>
    </div>
  )
}

function SectionTitle({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  )
}

function FinancialCard({
  title,
  value,
  icon: Icon,
  iconClassName,
}: {
  title: string
  value: number
  icon: typeof Wallet
  iconClassName: string
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            ₦{value.toLocaleString()}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClassName}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </Card>
  )
}

function ContactItem({
  icon: Icon,
  label,
  value,
  copyable = false,
  copied = false,
  onCopy,
}: {
  icon: typeof Mail
  label: string
  value: string
  copyable?: boolean
  copied?: boolean
  onCopy?: () => void
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-slate-700">
          {value}
        </p>
      </div>

      {copyable && onCopy && (
        <button
          type="button"
          onClick={onCopy}
          className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#0F766E]"
          title={`Copy ${label}`}
        >
          {copied ? (
            <CheckCircle2 size={16} />
          ) : (
            <Copy size={16} />
          )}
        </button>
      )}
    </div>
  )
}

function DetailRow({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof User
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  )
}

function MiniStat({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 text-center">
      <p className="text-xl font-bold text-slate-900">
        {value.toLocaleString()}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {label}
      </p>
    </div>
  )
}

function TaskStatistics({
  statistics,
}: {
  statistics: Record<string, unknown>
}) {
  const entries = Object.entries(statistics ?? {})

  if (!entries.length) {
    return (
      <EmptyState
        title="No task statistics"
        description="No task statistics are currently available for this member."
      />
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="rounded-xl border border-slate-100 bg-slate-50 p-4"
        >
          <p className="text-xs font-medium text-slate-500">
            {formatLabel(key)}
          </p>

          <p className="mt-2 text-lg font-bold text-slate-900">
            {formatValue(value)}
          </p>
        </div>
      ))}
    </div>
  )
}

function getInitials(
  firstName: string,
  lastName: string,
  username: string,
) {
  const first = firstName?.trim()?.[0] ?? ''
  const last = lastName?.trim()?.[0] ?? ''

  const initials = `${first}${last}`.toUpperCase()

  if (initials) return initials

  return username?.slice(0, 2).toUpperCase() || 'M'
}

function formatDate(value: string | null) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  )
}

function formatDateTime(
  value: string | null,
) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleString(
    undefined,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    },
  )
}

function formatStatus(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    )
}

function getStatusVariant(
  status: string,
): 'success' | 'warning' | 'danger' | 'neutral' {
  const normalized = status.toLowerCase()

  if (
    normalized.includes('active') ||
    normalized.includes('complete') ||
    normalized.includes('paid') ||
    normalized.includes('approved')
  ) {
    return 'success'
  }

  if (
    normalized.includes('pending') ||
    normalized.includes('progress')
  ) {
    return 'warning'
  }

  if (
    normalized.includes('reject') ||
    normalized.includes('cancel') ||
    normalized.includes('expire')
  ) {
    return 'danger'
  }

  return 'neutral'
}

function formatLabel(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    )
}

function formatValue(value: unknown) {
  if (value === null || value === undefined) {
    return '—'
  }

  if (
    typeof value === 'object'
  ) {
    return JSON.stringify(value)
  }

  return String(value)
}