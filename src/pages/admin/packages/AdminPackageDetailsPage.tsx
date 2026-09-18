import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  Edit3,
  Gift,
  Hash,
  Loader2,
  Package,
  Percent,
  Plus,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  useLocation,
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
  createAdminTenure,
  getAdminPackage,
  updateAdminPackage,
  updateAdminPackageStatus,
  updateAdminTenure,
  updateAdminTenureStatus,
} from '../../../services/adminPackageService'

import type {
  AdminPackage,
  AdminTenure,
  AdminTenurePayload,
} from '../../../types/admin/packages'

import PackageFormModal from './components/PackageFormModal'
import TenureFormModal from './components/TenureFormModal'

function formatCurrency(
  value: string | number | null,
) {
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

function formatDateTime(value: string) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function getTenureLabel(days: number) {
  if (days === 1) return '1 day'
  if (days < 30) return `${days} days`

  if (days % 365 === 0) {
    const years = days / 365
    return `${years} ${
      years === 1 ? 'year' : 'years'
    }`
  }

  if (days % 30 === 0) {
    const months = days / 30
    return `${months} ${
      months === 1 ? 'month' : 'months'
    }`
  }

  return `${days} days`
}

function DetailItem({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: React.ReactNode
  icon: React.ElementType
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Icon size={15} />
        {label}
      </div>

      <div className="mt-2 text-sm font-semibold text-slate-900">
        {value}
      </div>
    </div>
  )
}

export default function AdminPackageDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const isEditRoute = location.pathname.endsWith('/edit')
  const { accessToken } = useAuth()

  const [packageData, setPackageData] =
    useState<AdminPackage | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')

  const [isPackageModalOpen, setIsPackageModalOpen] =
    useState(false)

  const [isPackageSaving, setIsPackageSaving] =
    useState(false)

  const [packageFormError, setPackageFormError] =
    useState('')

  const [tenureModalOpen, setTenureModalOpen] =
    useState(false)

  const [tenureMode, setTenureMode] =
    useState<'create' | 'edit'>('create')

  const [selectedTenure, setSelectedTenure] =
    useState<AdminTenure | null>(null)

  const [isTenureSaving, setIsTenureSaving] =
    useState(false)

  const [tenureFormError, setTenureFormError] =
    useState('')

  const [updatingTenureId, setUpdatingTenureId] =
    useState<string | null>(null)

  const [updatingPackageStatus, setUpdatingPackageStatus] =
    useState(false)

  async function loadPackage(showLoader = true) {
    if (!accessToken || !id) return

    if (showLoader) {
      setIsLoading(true)
    } else {
      setIsRefreshing(true)
    }

    setError('')

    try {
      const response = await getAdminPackage(
        id,
        accessToken,
      )

      setPackageData(response)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load package.',
      )
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadPackage()
  }, [accessToken, id])

  useEffect(() => {
    if (packageData && isEditRoute) {
      setIsPackageModalOpen(true)
    }
  }, [packageData, isEditRoute])

  async function handlePackageStatus() {
    if (!packageData || !accessToken) return

    const nextStatus = !packageData.is_active

    const confirmed = window.confirm(
      `${nextStatus ? 'Activate' : 'Deactivate'} "${packageData.name}"?`,
    )

    if (!confirmed) return

    setUpdatingPackageStatus(true)
    setError('')

    try {
      const response =
        await updateAdminPackageStatus(
          packageData.id,
          nextStatus,
          accessToken,
        )

      setPackageData((current) =>
        current
          ? {
              ...current,
              is_active: response.is_active,
            }
          : current,
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update package status.',
      )
    } finally {
      setUpdatingPackageStatus(false)
    }
  }

  function openCreateTenure() {
    setSelectedTenure(null)
    setTenureMode('create')
    setTenureFormError('')
    setTenureModalOpen(true)
  }

  function openEditTenure(tenure: AdminTenure) {
    setSelectedTenure(tenure)
    setTenureMode('edit')
    setTenureFormError('')
    setTenureModalOpen(true)
  }

  async function handleTenureSubmit(
    data: AdminTenurePayload,
  ) {
    if (!accessToken || !packageData) return

    setIsTenureSaving(true)
    setTenureFormError('')

    try {
      if (tenureMode === 'create') {
        await createAdminTenure(
          packageData.id,
          data,
          accessToken,
        )
      } else if (selectedTenure) {
        await updateAdminTenure(
          selectedTenure.id,
          data,
          accessToken,
        )
      }

      setTenureModalOpen(false)
      setSelectedTenure(null)

      await loadPackage(false)
    } catch (err) {
      setTenureFormError(
        err instanceof Error
          ? err.message
          : 'Failed to save tenure.',
      )
    } finally {
      setIsTenureSaving(false)
    }
  }

  async function handleTenureStatus(
    tenure: AdminTenure,
  ) {
    if (!accessToken) return

    const nextStatus = !tenure.is_active

    const confirmed = window.confirm(
      `${nextStatus ? 'Activate' : 'Deactivate'} this ${getTenureLabel(
        tenure.duration_days,
      )} tenure?`,
    )

    if (!confirmed) return

    setUpdatingTenureId(tenure.id)
    setError('')

    try {
      const response =
        await updateAdminTenureStatus(
          tenure.id,
          nextStatus,
          accessToken,
        )

      setPackageData((current) => {
        if (!current) return current

        return {
          ...current,
          tenures: current.tenures.map((item) =>
            item.id === tenure.id
              ? {
                  ...item,
                  is_active: response.is_active,
                }
              : item,
          ),
        }
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update tenure status.',
      )
    } finally {
      setUpdatingTenureId(null)
    }
  }

  async function copyToClipboard(
    value: string,
  ) {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Clipboard may be unavailable in some browsers.
    }
  }

  if (isLoading) {
    return <PageLoader />
  }

  if (!packageData) {
    return (
      <div className="space-y-5">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/packages')}
        >
          <ArrowLeft size={17} className="mr-2" />
          Back to Packages
        </Button>

        <EmptyState
          title="Package not found"
          description={
            error ||
            'The requested package could not be loaded.'
          }
        />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Top navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/packages')}
          >
            <ArrowLeft size={17} className="mr-2" />
            Back to Packages
          </Button>

          <button
            type="button"
            onClick={() => loadPackage(false)}
            disabled={isRefreshing}
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                isRefreshing ? 'animate-spin' : ''
              }
            />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <Card className="border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </Card>
        )}

        {/* Hero */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-[#0F766E] to-[#115E59] p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                  <Package size={27} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold">
                      {packageData.name}
                    </h1>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        packageData.is_active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {packageData.is_active
                        ? 'Active'
                        : 'Inactive'}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-white/75">
                    {packageData.description ||
                      'No package description provided.'}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/70">
                    <span>Slug: {packageData.slug}</span>
                    <span>•</span>
                    <span>
                      Created{' '}
                      {formatDate(
                        packageData.created_at,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  onClick={() =>
                    setIsPackageModalOpen(true)
                  }
                >
                  <Edit3 size={16} className="mr-2" />
                  Edit
                </Button>

                <button
                  type="button"
                  onClick={handlePackageStatus}
                  disabled={updatingPackageStatus}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50"
                >
                  {updatingPackageStatus ? (
                    <Loader2
                      size={17}
                      className="mr-2 animate-spin"
                    />
                  ) : packageData.is_active ? (
                    <ToggleLeft
                      size={17}
                      className="mr-2"
                    />
                  ) : (
                    <ToggleRight
                      size={17}
                      className="mr-2"
                    />
                  )}

                  {packageData.is_active
                    ? 'Deactivate'
                    : 'Activate'}
                </button>
              </div>
            </div>
          </div>

          {/* Main pricing */}
          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
            <DetailItem
              label="Package Price"
              value={formatCurrency(
                packageData.price,
              )}
              icon={Wallet}
            />

            <DetailItem
              label="Payment Amount"
              value={formatCurrency(
                packageData.payment_amount,
              )}
              icon={Wallet}
            />

            <DetailItem
              label="Referral Bonus"
              value={`${packageData.referral_bonus_percentage}%`}
              icon={Percent}
            />

            <DetailItem
              label="Referral Points"
              value={packageData.referral_points}
              icon={Gift}
            />
          </div>
        </Card>

        {/* Package information */}
        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="p-5 sm:p-6 xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Package Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configuration and package metadata.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem
                label="Package ID"
                value={
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(packageData.id)
                    }
                    className="flex max-w-full items-center gap-2 text-left"
                    title="Copy ID"
                  >
                    <span className="truncate">
                      {packageData.id}
                    </span>
                    <Copy
                      size={14}
                      className="shrink-0 text-slate-400"
                    />
                  </button>
                }
                icon={Hash}
              />

              <DetailItem
                label="Display Order"
                value={packageData.display_order}
                icon={Hash}
              />

              <DetailItem
                label="Created"
                value={formatDateTime(
                  packageData.created_at,
                )}
                icon={CalendarDays}
              />

              <DetailItem
                label="Last Updated"
                value={formatDateTime(
                  packageData.updated_at,
                )}
                icon={Clock3}
              />
            </div>

            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {packageData.description ||
                  'No description provided.'}
              </p>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#0F766E]">
                <Gift size={19} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Referral Program
                </h2>

                <p className="text-xs text-slate-500">
                  Package referral configuration
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="text-sm text-slate-500">
                  Bonus percentage
                </span>

                <span className="font-bold text-slate-900">
                  {packageData.referral_bonus_percentage}%
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="text-sm text-slate-500">
                  Referral points
                </span>

                <span className="font-bold text-slate-900">
                  {packageData.referral_points}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Tenures */}
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Clock3 size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Package Tenures
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage the available durations for this
                    package.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={openCreateTenure}>
              <Plus size={17} className="mr-2" />
              Add Tenure
            </Button>
          </div>

          {packageData.tenures.length === 0 ? (
            <div className="p-5 sm:p-6">
              <EmptyState
                title="No tenures yet"
                description="Add a tenure to make this package available for members."
              />
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[800px]">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Duration
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Required Referrals
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                        Created
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {packageData.tenures.map(
                      (tenure) => (
                        <tr
                          key={tenure.id}
                          className="hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-900">
                              {getTenureLabel(
                                tenure.duration_days,
                              )}
                            </p>

                            <p className="text-xs text-slate-500">
                              {tenure.duration_days} days
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                              <Users
                                size={16}
                                className="text-slate-400"
                              />
                              {tenure.required_referrals}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <Badge
                              variant={
                                tenure.is_active
                                  ? 'success'
                                  : 'danger'
                              }
                            >
                              {tenure.is_active
                                ? 'Active'
                                : 'Inactive'}
                            </Badge>
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-500">
                            {formatDate(
                              tenure.created_at,
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openEditTenure(
                                    tenure,
                                  )
                                }
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#0F766E]"
                                title="Edit tenure"
                              >
                                <Edit3 size={17} />
                              </button>

                              <button
                                type="button"
                                disabled={
                                  updatingTenureId ===
                                  tenure.id
                                }
                                onClick={() =>
                                  handleTenureStatus(
                                    tenure,
                                  )
                                }
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#0F766E] disabled:opacity-50"
                                title={
                                  tenure.is_active
                                    ? 'Deactivate'
                                    : 'Activate'
                                }
                              >
                                {tenure.is_active ? (
                                  <ToggleRight
                                    size={19}
                                  />
                                ) : (
                                  <ToggleLeft
                                    size={19}
                                  />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="space-y-3 p-4 lg:hidden">
                {packageData.tenures.map(
                  (tenure) => (
                    <div
                      key={tenure.id}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {getTenureLabel(
                              tenure.duration_days,
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {tenure.duration_days} days
                          </p>
                        </div>

                        <Badge
                          variant={
                            tenure.is_active
                              ? 'success'
                              : 'danger'
                          }
                        >
                          {tenure.is_active
                            ? 'Active'
                            : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="mt-4 rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">
                          Required Referrals
                        </p>

                        <p className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-900">
                          <Users size={15} />
                          {tenure.required_referrals}
                        </p>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() =>
                            openEditTenure(tenure)
                          }
                        >
                          <Edit3
                            size={15}
                            className="mr-2"
                          />
                          Edit
                        </Button>

                        <button
                          type="button"
                          disabled={
                            updatingTenureId ===
                            tenure.id
                          }
                          onClick={() =>
                            handleTenureStatus(
                              tenure,
                            )
                          }
                          className="flex h-12 items-center justify-center rounded-xl border border-slate-200 px-4 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        >
                          {tenure.is_active ? (
                            <ToggleLeft size={18} />
                          ) : (
                            <ToggleRight size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </>
          )}
        </Card>

        {/* Status note */}
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          {packageData.is_active ? (
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-emerald-600"
            />
          ) : (
            <XCircle
              size={19}
              className="mt-0.5 shrink-0 text-red-600"
            />
          )}

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Package is{' '}
              {packageData.is_active
                ? 'currently active'
                : 'currently inactive'}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {packageData.is_active
                ? 'This package can be used according to the active tenures configured above.'
                : 'This package is currently disabled and should not be available for new member usage.'}
            </p>
          </div>
        </div>
      </div>

      <PackageFormModal
        isOpen={isPackageModalOpen}
        mode="edit"
        packageData={packageData}
        isSubmitting={isPackageSaving}
        error={packageFormError}
        onClose={() => {
          if (!isPackageSaving) {
            setIsPackageModalOpen(false)
            setPackageFormError('')
          }
        }}
        onSubmit={async (data) => {
          if (!accessToken || !packageData) return

          setIsPackageSaving(true)
          setPackageFormError('')

          try {
            

            const updated =
              await updateAdminPackage(
                packageData.id,
                data,
                accessToken,
              )

            setPackageData((current) =>
              current
                ? {
                    ...current,
                    ...updated,
                    tenures:
                      updated.tenures ??
                      current.tenures,
                  }
                : updated,
            )

            setIsPackageModalOpen(false)

            navigate(`/admin/packages/${packageData.id}`, {
              replace: true,
            })
          } catch (err) {
            setPackageFormError(
              err instanceof Error
                ? err.message
                : 'Failed to update package.',
            )
          } finally {
            setIsPackageSaving(false)
          }
        }}
      />

      <TenureFormModal
        isOpen={tenureModalOpen}
        mode={tenureMode}
        tenure={selectedTenure}
        isSubmitting={isTenureSaving}
        error={tenureFormError}
        onClose={() => {
          if (!isTenureSaving) {
            setTenureModalOpen(false)
            setSelectedTenure(null)
            setTenureFormError('')
          }
        }}
        onSubmit={handleTenureSubmit}
      />
    </>
  )
}