import { useEffect, useMemo, useState } from 'react'
import {
  Building2,
  ExternalLink,
  Globe,
  Search,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import { getPartners } from '../../services/partnerService'
import type { Partner } from '../../types/partner'

import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import PageLoader from '../../components/ui/PageLoader'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getLogoUrl(logo: string | null) {
  if (!logo) return null

  if (logo.startsWith('http://') || logo.startsWith('https://')) {
    return logo
  }

  return `http://127.0.0.1:8000${logo.startsWith('/') ? '' : '/'}${logo}`
}

export default function PartnersPage() {
  const { accessToken } = useAuth()

  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadPartners() {
      if (!accessToken) return

      setIsLoading(true)
      setError('')

      try {
        const data = await getPartners(accessToken)
        setPartners(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load partners.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadPartners()
  }, [accessToken])

  const filteredPartners = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return partners
    }

    return partners.filter(
      (partner) =>
        partner.name.toLowerCase().includes(query) ||
        partner.description.toLowerCase().includes(query),
    )
  }, [partners, search])

  function openWebsite(partner: Partner) {
    if (!partner.website) return

    window.open(
      partner.website,
      '_blank',
      'noopener,noreferrer',
    )
  }

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Building2 size={22} />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Partners
            </h1>

            <p className="text-sm text-slate-500">
              Explore companies partnered with Cash4Us.
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Search */}
      <Card>
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search partners..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </Card>

      <div className="text-sm text-slate-500">
        {filteredPartners.length}{' '}
        {filteredPartners.length === 1
          ? 'partner'
          : 'partners'}
      </div>

      {/* Empty */}
      {!filteredPartners.length ? (
        <EmptyState
          title={
            partners.length
              ? 'No partners found'
              : 'No partners available'
          }
          description={
            partners.length
              ? 'Try a different search.'
              : 'There are currently no active partners available.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredPartners.map((partner) => {
            const logoUrl = getLogoUrl(partner.logo)

            return (
              <Card
                key={partner.id}
                className="flex h-full flex-col transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={`${partner.name} logo`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Building2
                        size={24}
                        className="text-slate-400"
                      />
                    )}
                  </div>

                  {partner.website && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      Partner
                    </span>
                  )}
                </div>

                <div className="mt-4 flex-1">
                  <h2 className="text-base font-semibold text-slate-900">
                    {partner.name}
                  </h2>

                  {partner.description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                      {partner.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                    <Globe size={14} />
                    <span>
                      Added {formatDate(partner.created_at)}
                    </span>
                  </div>

                  {partner.website && (
                    <button
                      type="button"
                      onClick={() => openWebsite(partner)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
                    >
                      Visit Website
                      <ExternalLink size={15} />
                    </button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}