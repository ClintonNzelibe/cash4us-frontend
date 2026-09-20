import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import {
  getAdminAdvertisers,
  updateAdminAdvertiserStatus,
} from '../../../services/adminAdvertisingService'

import type {
  AdminAdvertiser,
  AdvertisingFilters,
} from '../../../types/admin/advertising'

import AdvertisingFiltersComponent from './components/AdvertisingFilters'

export default function AdminAdvertisersPage() {
  const { accessToken } = useAuth()

  const [advertisers, setAdvertisers] =
    useState<AdminAdvertiser[]>([])

  const [filters, setFilters] =
    useState<AdvertisingFilters>({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    const token = accessToken

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getAdminAdvertisers(
          token,
          filters,
        )

        setAdvertisers(
          Array.isArray(response)
            ? response
            : Array.isArray(response?.results)
              ? response.results
              : [],
        )
      } catch (error) {
        setAdvertisers([])

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load advertisers.',
        )
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => window.clearTimeout(timer)
  }, [accessToken, filters])

  const toggleStatus = async (
    advertiser: AdminAdvertiser,
  ) => {
    if (!accessToken) return

    try {
      setError('')

      await updateAdminAdvertiserStatus(
        accessToken,
        advertiser.id,
        !advertiser.is_active,
      )

      setAdvertisers((current) =>
        current.map((item) =>
          item.id === advertiser.id
            ? {
                ...item,
                is_active: !item.is_active,
              }
            : item,
        ),
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update advertiser status.',
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Advertisers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage companies and individuals advertising within Cash4Us.
          </p>
        </div>

        <Link
          to="/admin/advertising/advertisers/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#115E59]"
        >
          <Plus size={17} />
          Add Advertiser
        </Link>
      </div>

      <Card>
        <AdvertisingFiltersComponent
          filters={filters}
          onChange={setFilters}
          mode="advertisers"
        />
      </Card>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <PageLoader />
      ) : (
        <Card className="overflow-hidden p-0">
          {advertisers.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No advertisers found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Advertiser
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Contact
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Campaigns
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {advertisers.map((advertiser) => (
                    <tr
                      key={advertiser.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {advertiser.company_name ||
                            advertiser.name}
                        </p>

                        {advertiser.company_name && (
                          <p className="text-xs text-slate-500">
                            {advertiser.name}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700">
                          {advertiser.email || '—'}
                        </p>

                        <p className="text-xs text-slate-500">
                          {advertiser.phone || '—'}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                        {advertiser.campaign_count}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            toggleStatus(advertiser)
                          }
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            advertiser.is_active
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {advertiser.is_active
                            ? 'Active'
                            : 'Inactive'}
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          to={`/admin/advertising/advertisers/${advertiser.id}`}
                          className="text-sm font-semibold text-[#0F766E] hover:text-[#115E59]"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}