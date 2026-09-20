import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import { getAdminCampaigns } from '../../../services/adminAdvertisingService'

import type {
  AdminCampaign,
  AdvertisingFilters,
} from '../../../types/admin/advertising'

import AdvertisingStatusBadge from './components/AdvertisingStatusBadge'
import AdvertisingFiltersComponent from './components/AdvertisingFilters'

export default function AdminCampaignsPage() {
  const { accessToken } = useAuth()

  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([])
  const [filters, setFilters] =
    useState<AdvertisingFilters>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadCampaigns = async () => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await getAdminCampaigns(
        accessToken,
        filters,
      )

      setCampaigns(
        Array.isArray(response)
          ? response
          : response.results || [],
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load campaigns.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCampaigns()
  }, [accessToken, filters])

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Advertising Campaigns
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage advertising campaigns and their status.
          </p>
        </div>

        <Link
          to="/admin/advertising/campaigns/create"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          + New Campaign
        </Link>
      </div>

      {/* Filters */}
      <AdvertisingFiltersComponent
        mode="campaigns"
        filters={filters}
        onChange={setFilters}
      />

      {/* Error */}
      {error && (
        <Card>
          <div className="flex items-center justify-between gap-4 p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadCampaigns}
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Retry
            </button>
          </div>
        </Card>
      )}

      {/* Campaign Table */}
      <Card>
        <div className="border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Campaigns
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {campaigns.length} campaign
              {campaigns.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Campaign
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Advertiser
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Dates
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Revenue
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  {/* Campaign */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">
                        {campaign.title}
                      </p>

                      {campaign.description && (
                        <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                          {campaign.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Advertiser */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700">
                      {campaign.advertiser_name || '—'}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <AdvertisingStatusBadge
                      status={campaign.status}
                    />
                  </td>

                  {/* Dates */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">
                      <p>
                        {campaign.start_date || 'No start date'}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {campaign.end_date
                          ? `Ends ${campaign.end_date}`
                          : 'No end date'}
                      </p>
                    </div>
                  </td>

                  {/* Revenue */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-700">
                      {campaign.revenue_count}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/admin/advertising/campaigns/${campaign.id}`}
                      className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {campaigns.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center"
                  >
                    <div className="mx-auto max-w-sm">
                      <p className="text-sm font-medium text-slate-700">
                        No campaigns found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        There are no advertising campaigns
                        matching the current filters.
                      </p>

                      <Link
                        to="/admin/advertising/campaigns/create"
                        className="mt-4 inline-flex items-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
                      >
                        Create Campaign
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}