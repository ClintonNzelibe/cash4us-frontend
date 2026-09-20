import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import { getAdminCampaign } from '../../../services/adminAdvertisingService'

import type { AdminCampaign } from '../../../types/admin/advertising'

import AdvertisingStatusBadge from './components/AdvertisingStatusBadge'

export default function AdminCampaignDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [campaign, setCampaign] = useState<AdminCampaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id || !accessToken) {
      setLoading(false)
      return
    }

    const loadCampaign = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getAdminCampaign(accessToken, id)
        setCampaign(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load campaign.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadCampaign()
  }, [id, accessToken])

  if (loading) {
    return <PageLoader />
  }

  if (!campaign) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/admin/advertising/campaigns')}
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Campaigns
        </button>

        <Card>
          <div className="p-6 text-sm text-red-600">
            {error || 'Campaign not found.'}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate('/admin/advertising/campaigns')}
          className="mb-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Campaigns
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {campaign.title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {campaign.advertiser_name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <AdvertisingStatusBadge status={campaign.status} />

            <Link
              to={`/admin/advertising/campaigns/${campaign.id}/edit`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <Card>
          <div className="p-4 text-sm text-red-600">
            {error}
          </div>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <div className="p-6">
            <p className="text-sm text-slate-500">Status</p>

            <div className="mt-3">
              <AdvertisingStatusBadge status={campaign.status} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <p className="text-sm text-slate-500">Revenue Records</p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {campaign.revenue_count}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <p className="text-sm text-slate-500">Created</p>

            <p className="mt-2 text-sm font-medium text-slate-900">
              {new Date(campaign.created_at).toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Campaign Information
          </h2>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Description
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {campaign.description || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Advertiser
            </p>

            <p className="mt-1 text-sm text-slate-900">
              {campaign.advertiser_name}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Campaign URL
            </p>

            {campaign.campaign_url ? (
              <a
                href={campaign.campaign_url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block truncate text-sm text-emerald-700 hover:text-emerald-800"
              >
                {campaign.campaign_url}
              </a>
            ) : (
              <p className="mt-1 text-sm text-slate-500">—</p>
            )}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Start Date
            </p>

            <p className="mt-1 text-sm text-slate-900">
              {campaign.start_date || '—'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              End Date
            </p>

            <p className="mt-1 text-sm text-slate-900">
              {campaign.end_date || '—'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}