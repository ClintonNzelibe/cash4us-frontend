import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, RefreshCw } from 'lucide-react'

import { useAuth } from '../../../context/AuthContext'
import {
  getAdminPartners,
  updateAdminPartnerStatus,
} from '../../../services/adminPartnerService'
import type {
  AdminPartner,
  PartnerFilters as PartnerFilterValues,
} from '../../../types/admin/partners'

import PartnerStatusBadge from './components/PartnerStatusBadge'
import PartnerFilters from './components/PartnerFilters'
import PartnerActionModal from './components/PartnerActionModal'

export default function AdminPartnersPage() {
  const { accessToken } = useAuth()

  const [partners, setPartners] = useState<AdminPartner[]>([])
  const [filters, setFilters] = useState<PartnerFilterValues>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedPartner, setSelectedPartner] =
    useState<AdminPartner | null>(null)

  const [statusLoading, setStatusLoading] = useState(false)

  const loadPartners = useCallback(async () => {
    if (!accessToken) {
      return
    }

    try {
      setLoading(true)
      setError('')

      const data = await getAdminPartners(accessToken, filters)
      setPartners(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load partners.',
      )
    } finally {
      setLoading(false)
    }
  }, [accessToken, filters])

  useEffect(() => {
    void loadPartners()
  }, [loadPartners])

  async function handleStatusChange() {
    if (!accessToken || !selectedPartner) {
      return
    }

    try {
      setStatusLoading(true)

      await updateAdminPartnerStatus(
        accessToken,
        selectedPartner.id,
        {
          is_active: !selectedPartner.is_active,
        },
      )

      setSelectedPartner(null)
      await loadPartners()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update partner status.',
      )
    } finally {
      setStatusLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Partners
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage Cash4Us partner companies.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadPartners()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>

          <Link
            to="/admin/partners/create"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Plus size={16} />
            Add Partner
          </Link>
        </div>
      </div>

      <PartnerFilters
        filters={filters}
        onChange={setFilters}
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Partner
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Website
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Created
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading partners...
                  </td>
                </tr>
              ) : partners.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No partners found.
                  </td>
                </tr>
              ) : (
                partners.map((partner) => (
                  <tr
                    key={partner.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {partner.logo ? (
                          <img
                            src={partner.logo}
                            alt={partner.name}
                            className="h-10 w-10 rounded-lg border border-slate-200 object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-sm font-semibold text-emerald-700">
                            {partner.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-slate-900">
                            {partner.name}
                          </p>

                          {partner.description && (
                            <p className="max-w-xs truncate text-xs text-slate-500">
                              {partner.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {partner.website ? (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          Visit website
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <PartnerStatusBadge
                        isActive={partner.is_active}
                      />
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {new Date(
                        partner.created_at,
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/partners/${partner.id}`}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          View
                        </Link>

                        <Link
                          to={`/admin/partners/${partner.id}/edit`}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPartner(partner)
                          }
                          className={`rounded-lg px-3 py-2 text-xs font-medium ${
                            partner.is_active
                              ? 'border border-red-200 text-red-600 hover:bg-red-50'
                              : 'border border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {partner.is_active
                            ? 'Deactivate'
                            : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PartnerActionModal
        isOpen={Boolean(selectedPartner)}
        title={
          selectedPartner?.is_active
            ? 'Deactivate partner'
            : 'Activate partner'
        }
        message={
          selectedPartner
            ? `Are you sure you want to ${
                selectedPartner.is_active
                  ? 'deactivate'
                  : 'activate'
              } ${selectedPartner.name}?`
            : ''
        }
        confirmLabel={
          selectedPartner?.is_active
            ? 'Deactivate'
            : 'Activate'
        }
        loading={statusLoading}
        onConfirm={() => void handleStatusChange()}
        onClose={() => setSelectedPartner(null)}
      />
    </div>
  )
}