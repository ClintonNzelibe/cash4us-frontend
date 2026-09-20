import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import {
  getAdminAdvertiser,
  updateAdminAdvertiserStatus,
} from '../../../services/adminAdvertisingService'

import type { AdminAdvertiser } from '../../../types/admin/advertising'

import AdvertisingStatusBadge from './components/AdvertisingStatusBadge'

export default function AdminAdvertiserDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [advertiser, setAdvertiser] = useState<AdminAdvertiser | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id || !accessToken) {
      setLoading(false)
      return
    }

    const loadAdvertiser = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getAdminAdvertiser(accessToken, id)
        setAdvertiser(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load advertiser.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadAdvertiser()
  }, [id, accessToken])

  const handleStatusChange = async () => {
    if (!advertiser || !accessToken) return

    try {
      setActionLoading(true)
      setError('')

      await updateAdminAdvertiserStatus(
        accessToken,
        advertiser.id,
        !advertiser.is_active,
      )

      setAdvertiser({
        ...advertiser,
        is_active: !advertiser.is_active,
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update advertiser status.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <PageLoader />
  }

  if (error && !advertiser) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/admin/advertising/advertisers')}
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Advertisers
        </button>

        <Card>
          <div className="p-6 text-sm text-red-600">
            {error}
          </div>
        </Card>
      </div>
    )
  }

  if (!advertiser) {
    return (
      <Card>
        <div className="p-6 text-sm text-slate-500">
          Advertiser not found.
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate('/admin/advertising/advertisers')}
            className="mb-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            ← Back to Advertisers
          </button>

          <h1 className="text-2xl font-semibold text-slate-900">
            {advertiser.name}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Advertiser details and account status
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/admin/advertising/advertisers/${advertiser.id}/edit`}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={handleStatusChange}
            disabled={actionLoading}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              advertiser.is_active
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-emerald-700 hover:bg-emerald-800'
            }`}
          >
            {actionLoading
              ? 'Updating...'
              : advertiser.is_active
                ? 'Deactivate'
                : 'Activate'}
          </button>
        </div>
      </div>

      {error && (
        <Card>
          <div className="p-4 text-sm text-red-600">
            {error}
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <div className="p-6">
            <p className="text-sm text-slate-500">Status</p>

            <div className="mt-3">
              <AdvertisingStatusBadge
                status={advertiser.is_active ? 'ACTIVE' : 'CANCELLED'}
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <p className="text-sm text-slate-500">Campaigns</p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {advertiser.campaign_count}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <p className="text-sm text-slate-500">Created</p>

            <p className="mt-2 text-sm font-medium text-slate-900">
              {new Date(advertiser.created_at).toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Contact Information
          </h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Name
            </p>
            <p className="mt-1 text-sm text-slate-900">
              {advertiser.name || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Company
            </p>
            <p className="mt-1 text-sm text-slate-900">
              {advertiser.company_name || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Email
            </p>
            <p className="mt-1 text-sm text-slate-900">
              {advertiser.email || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Phone
            </p>
            <p className="mt-1 text-sm text-slate-900">
              {advertiser.phone || '—'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}