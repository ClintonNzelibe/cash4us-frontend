import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil } from 'lucide-react'

import { useAuth } from '../../../context/AuthContext'
import { getAdminPartner } from '../../../services/adminPartnerService'
import type { AdminPartner } from '../../../types/admin/partners'

import PartnerStatusBadge from './components/PartnerStatusBadge'

export default function AdminPartnerDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()

  const [partner, setPartner] = useState<AdminPartner | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPartner = useCallback(async () => {
    if (!accessToken || !id) {
      return
    }

    try {
      setLoading(true)
      setError('')

      const data = await getAdminPartner(accessToken, id)
      setPartner(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load partner.',
      )
    } finally {
      setLoading(false)
    }
  }, [accessToken, id])

  useEffect(() => {
    void loadPartner()
  }, [loadPartner])

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Loading partner...
      </div>
    )
  }

  if (error || !partner) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/partners"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Partners
        </Link>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || 'Partner not found.'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Link
            to="/admin/partners"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Partners
          </Link>

          <h1 className="text-2xl font-semibold text-slate-900">
            {partner.name}
          </h1>
        </div>

        <Link
          to={`/admin/partners/${partner.id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Pencil size={16} />
          Edit Partner
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col items-center text-center">
            {partner.logo ? (
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-32 w-32 rounded-xl border border-slate-200 object-contain p-3"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-emerald-50 text-4xl font-semibold text-emerald-700">
                {partner.name.charAt(0).toUpperCase()}
              </div>
            )}

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              {partner.name}
            </h2>

            <div className="mt-2">
              <PartnerStatusBadge
                isActive={partner.is_active}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">
            Partner details
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Description
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {partner.description || 'No description provided.'}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Website
              </p>

              {partner.website ? (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm text-emerald-600 hover:text-emerald-700"
                >
                  {partner.website}
                </a>
              ) : (
                <p className="mt-1 text-sm text-slate-500">
                  No website provided.
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Created
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {new Date(
                    partner.created_at,
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Last updated
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {new Date(
                    partner.updated_at,
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}