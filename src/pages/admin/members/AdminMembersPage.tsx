import {
  ChevronRight,
  RefreshCw,
  Search,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import EmptyState from '../../../components/ui/EmptyState'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'
import {
  getAdminMembers,
  updateAdminMemberStatus,
} from '../../../services/adminMemberService'

import type { AdminMember } from '../../../types/admin/members'

type MemberFilter = 'all' | 'active' | 'inactive'

export default function AdminMembersPage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [members, setMembers] = useState<AdminMember[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] =
    useState<MemberFilter>('all')

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [updatingId, setUpdatingId] =
    useState<string | null>(null)
  const [error, setError] = useState('')

  const loadMembers = useCallback(
    async (refresh = false) => {
      if (!accessToken) return

      try {
        setError('')

        if (refresh) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        const response = await getAdminMembers(
          accessToken,
          {
            search: search || undefined,
            is_active:
              filter === 'all'
                ? undefined
                : filter === 'active',
          },
        )

        const results = Array.isArray(response)
          ? response
          : response.results ?? []

        setMembers(results)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load members.',
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [accessToken, search, filter],
  )

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadMembers()
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [loadMembers])

  async function handleStatusChange(
    member: AdminMember,
  ) {
    if (!accessToken || updatingId) return

    const nextStatus = !member.is_active

    const confirmed = window.confirm(
      nextStatus
        ? `Activate ${member.email}?`
        : `Deactivate ${member.email}?`,
    )

    if (!confirmed) return

    try {
      setUpdatingId(member.id)
      setError('')

      await updateAdminMemberStatus(
        member.id,
        nextStatus,
        accessToken,
      )

      setMembers((current) =>
        current.map((item) =>
          item.id === member.id
            ? {
                ...item,
                is_active: nextStatus,
              }
            : item,
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update member status.',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const activeCount = useMemo(
    () =>
      members.filter(
        (member) => member.is_active,
      ).length,
    [members],
  )

  const inactiveCount = members.length - activeCount

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-[#0F766E]">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Members
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View and manage registered Cash4Us members.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => loadMembers(true)}
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

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Members"
          value={members.length}
          icon={Users}
        />

        <SummaryCard
          title="Active"
          value={activeCount}
          icon={UserCheck}
          iconClassName="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          title="Inactive"
          value={inactiveCount}
          icon={UserX}
          iconClassName="bg-red-50 text-red-600"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Search + filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search members..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
            />
          </div>

          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <FilterButton
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All
            </FilterButton>

            <FilterButton
              active={filter === 'active'}
              onClick={() => setFilter('active')}
            >
              Active
            </FilterButton>

            <FilterButton
              active={filter === 'inactive'}
              onClick={() => setFilter('inactive')}
            >
              Inactive
            </FilterButton>
          </div>
        </div>
      </Card>

      {/* Desktop */}
      <Card className="hidden overflow-hidden md:block">
        {members.length === 0 ? (
          <EmptyState
            title="No members found"
            description="Try another search or filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <TableHeading>
                    Member
                  </TableHeading>
                  <TableHeading>
                    Membership
                  </TableHeading>
                  <TableHeading>
                    Wallet
                  </TableHeading>
                  <TableHeading>
                    Referrals
                  </TableHeading>
                  <TableHeading>
                    Status
                  </TableHeading>
                  <TableHeading align="right">
                    Actions
                  </TableHeading>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {members.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    updating={
                      updatingId === member.id
                    }
                    onView={() =>
                      navigate(
                        `/admin/members/${member.id}`,
                      )
                    }
                    onStatusChange={() =>
                      handleStatusChange(member)
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        {members.length === 0 ? (
          <EmptyState
            title="No members found"
            description="Try another search or filter."
          />
        ) : (
          members.map((member) => (
            <MobileMemberCard
              key={member.id}
              member={member}
              updating={
                updatingId === member.id
              }
              onView={() =>
                navigate(
                  `/admin/members/${member.id}`,
                )
              }
              onStatusChange={() =>
                handleStatusChange(member)
              }
            />
          ))
        )}
      </div>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  iconClassName = 'bg-slate-100 text-slate-600',
}: {
  title: string
  value: number
  icon: typeof Users
  iconClassName?: string
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value.toLocaleString()}
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

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
        active
          ? 'bg-white text-[#0F766E] shadow-sm'
          : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {children}
    </button>
  )
}

function TableHeading({
  children,
  align = 'left',
}: {
  children: React.ReactNode
  align?: 'left' | 'right'
}) {
  return (
    <th
      className={`px-5 py-4 text-${align} text-xs font-semibold uppercase tracking-wide text-slate-500`}
    >
      {children}
    </th>
  )
}

function MemberRow({
  member,
  updating,
  onView,
  onStatusChange,
}: {
  member: AdminMember
  updating: boolean
  onView: () => void
  onStatusChange: () => void
}) {
  const fullName =
    `${member.first_name} ${member.last_name}`.trim()

  return (
    <tr className="transition hover:bg-slate-50/70">
      <td className="px-5 py-4">
        <button
          type="button"
          onClick={onView}
          className="text-left"
        >
          <p className="font-semibold text-slate-900 hover:text-[#0F766E]">
            {fullName || member.username}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {member.email}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            @{member.username}
          </p>
        </button>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-slate-700">
          {member.membership_code || '—'}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {member.current_cycle?.package ||
            'No active cycle'}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">
          ₦
          {Number(
            member.wallet?.balance ?? 0,
          ).toLocaleString()}
        </p>
      </td>

      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">
          {member.referrals?.total ?? 0}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {member.referrals?.paid ?? 0} paid
        </p>
      </td>

      <td className="px-5 py-4">
        <Badge
          variant={
            member.is_active
              ? 'success'
              : 'danger'
          }
        >
          {member.is_active
            ? 'Active'
            : 'Inactive'}
        </Badge>
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onView}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-[#0F766E]"
            title="View member"
          >
            <ChevronRight size={18} />
          </button>

          <button
            type="button"
            disabled={updating}
            onClick={onStatusChange}
            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
              member.is_active
                ? 'text-red-600 hover:bg-red-50'
                : 'text-emerald-600 hover:bg-emerald-50'
            } disabled:opacity-50`}
          >
            {updating
              ? 'Updating...'
              : member.is_active
                ? 'Deactivate'
                : 'Activate'}
          </button>
        </div>
      </td>
    </tr>
  )
}

function MobileMemberCard({
  member,
  updating,
  onView,
  onStatusChange,
}: {
  member: AdminMember
  updating: boolean
  onView: () => void
  onStatusChange: () => void
}) {
  const fullName =
    `${member.first_name} ${member.last_name}`.trim()

  return (
    <Card className="p-4">
      <button
        type="button"
        onClick={onView}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-900">
              {fullName || member.username}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {member.email}
            </p>
          </div>

          <ChevronRight
            size={18}
            className="text-slate-400"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <InfoItem
            label="Membership"
            value={
              member.membership_code || '—'
            }
          />

          <InfoItem
            label="Wallet"
            value={`₦${Number(
              member.wallet?.balance ?? 0,
            ).toLocaleString()}`}
          />

          <InfoItem
            label="Referrals"
            value={String(
              member.referrals?.total ?? 0,
            )}
          />

          <div>
            <p className="text-xs text-slate-400">
              Status
            </p>

            <div className="mt-1">
              <Badge
                variant={
                  member.is_active
                    ? 'success'
                    : 'danger'
                }
              >
                {member.is_active
                  ? 'Active'
                  : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>
      </button>

      <button
        type="button"
        disabled={updating}
        onClick={onStatusChange}
        className={`mt-4 w-full rounded-xl border py-2.5 text-xs font-semibold ${
          member.is_active
            ? 'border-red-200 text-red-600 hover:bg-red-50'
            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
        } disabled:opacity-50`}
      >
        {updating
          ? 'Updating...'
          : member.is_active
            ? 'Deactivate Member'
            : 'Activate Member'}
      </button>
    </Card>
  )
}

function InfoItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  )
}