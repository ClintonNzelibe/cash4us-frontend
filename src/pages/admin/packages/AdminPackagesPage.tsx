import {
  Eye,
  Filter,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import EmptyState from '../../../components/ui/EmptyState'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import {
  getAdminPackages,
  updateAdminPackageStatus,
} from '../../../services/adminPackageService'

import type {
  AdminPackage,
  AdminPackageListResponse,
} from '../../../types/admin/packages'

type FilterValue = 'all' | 'active' | 'inactive'

function extractPackages(
  response: AdminPackage[] | AdminPackageListResponse,
): AdminPackage[] {
  if (Array.isArray(response)) {
    return response
  }

  return response.results ?? []
}

function formatCurrency(value: string | number | null) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return String(value)
  }

  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(value: string) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getStatusVariant(
  isActive: boolean,
): 'success' | 'danger' {
  return isActive ? 'success' : 'danger'
}

export default function AdminPackagesPage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [packages, setPackages] = useState<AdminPackage[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterValue>('all')

  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const [error, setError] = useState('')

  async function loadPackages(showLoader = true) {
    if (!accessToken) return

    if (showLoader) {
      setIsLoading(true)
    } else {
      setIsRefreshing(true)
    }

    setError('')

    try {
      const response = await getAdminPackages(accessToken, {
        search,
        is_active:
          filter === 'all'
            ? undefined
            : filter === 'active'
                ? true
                : false,
      })

      setPackages(extractPackages(response))
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load packages.',
      )
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadPackages()
    }, 300)

    return () => window.clearTimeout(timer)
  }, [accessToken, search, filter])

  const statistics = useMemo(() => {
    return {
      total: packages.length,
      active: packages.filter((item) => item.is_active).length,
      inactive: packages.filter((item) => !item.is_active).length,
      tenures: packages.reduce(
        (total, item) => total + item.tenures.length,
        0,
      ),
    }
  }, [packages])

  async function handleToggleStatus(
    item: AdminPackage,
  ) {
    if (!accessToken) return

    const nextStatus = !item.is_active

    const confirmed = window.confirm(
      `${nextStatus ? 'Activate' : 'Deactivate'} "${item.name}"?`,
    )

    if (!confirmed) return

    setUpdatingId(item.id)
    setError('')

    try {
      const response = await updateAdminPackageStatus(
        item.id,
        nextStatus,
        accessToken,
      )

      setPackages((current) =>
        current.map((pkg) =>
          pkg.id === item.id
            ? {
                ...pkg,
                is_active: response.is_active,
              }
            : pkg,
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update package status.',
      )
    } finally {
      setUpdatingId(null)
    }
  }

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#0F766E]">
              <Package size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Packages
              </h2>

              <p className="text-sm text-slate-500">
                Manage membership packages and their tenures.
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => navigate('/admin/packages/new')}
        >
          <Plus size={18} className="mr-2" />
          Create Package
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-sm text-slate-500">
            Total Packages
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {statistics.total}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-slate-500">
            Active Packages
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {statistics.active}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-slate-500">
            Inactive Packages
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {statistics.inactive}
          </p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-slate-500">
            Total Tenures
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {statistics.tenures}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search packages..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-1 hidden items-center gap-2 text-sm text-slate-500 sm:flex">
              <Filter size={16} />
              Status
            </div>

            {(['all', 'active', 'inactive'] as FilterValue[]).map(
              (value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    filter === value
                      ? 'bg-[#0F766E] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {value.charAt(0).toUpperCase() +
                    value.slice(1)}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() => loadPackages(false)}
              disabled={isRefreshing}
              className="ml-auto flex h-11 items-center justify-center rounded-xl border border-slate-200 px-3 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw
                size={18}
                className={
                  isRefreshing ? 'animate-spin' : ''
                }
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => loadPackages()}
              className="text-sm font-semibold text-red-700 underline"
            >
              Retry
            </button>
          </div>
        </Card>
      )}

      {/* Desktop table */}
      {packages.length > 0 ? (
        <>
          <Card className="hidden overflow-hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Package
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Referral
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Tenures
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {packages.map((item) => (
                    <tr
                      key={item.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {item.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {item.slug}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {formatCurrency(item.price)}
                        </p>

                        <p className="text-xs text-slate-500">
                          Payment:{' '}
                          {formatCurrency(
                            item.payment_amount,
                          )}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {item.referral_bonus_percentage}%
                        </p>

                        <p className="text-xs text-slate-500">
                          {item.referral_points} points
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-900">
                          {item.tenures.length}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <Badge
                          variant={getStatusVariant(
                            item.is_active,
                          )}
                        >
                          {item.is_active
                            ? 'Active'
                            : 'Inactive'}
                        </Badge>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/packages/${item.id}/edit`)
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#0F766E]"
                            title="View package"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/packages/${item.id}/edit`,
                              )
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#0F766E]"
                            title="Edit package"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            disabled={
                              updatingId === item.id
                            }
                            onClick={() =>
                              handleToggleStatus(item)
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#0F766E] disabled:opacity-50"
                            title={
                              item.is_active
                                ? 'Deactivate'
                                : 'Activate'
                            }
                          >
                            {item.is_active ? (
                              <ToggleRight size={19} />
                            ) : (
                              <ToggleLeft size={19} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile / tablet */}
          <div className="space-y-3 lg:hidden">
            {packages.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-900">
                      {item.name}
                    </h3>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {item.slug}
                    </p>
                  </div>

                  <Badge
                    variant={getStatusVariant(
                      item.is_active,
                    )}
                  >
                    {item.is_active
                      ? 'Active'
                      : 'Inactive'}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      Price
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      Tenures
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {item.tenures.length}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      Referral Bonus
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {item.referral_bonus_percentage}%
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      Created
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      navigate(
                        `/admin/packages/${item.id}`,
                      )
                    }
                  >
                    <Eye size={16} className="mr-2" />
                    View
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      navigate(
                        `/admin/packages/${item.id}/edit`,
                      )
                    }
                  >
                    <Pencil size={16} className="mr-2" />
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          title="No packages found"
          description={
            search
              ? 'Try adjusting your search or filters.'
              : 'Create your first membership package to get started.'
          }
        />
      )}
    </div>
  )
}