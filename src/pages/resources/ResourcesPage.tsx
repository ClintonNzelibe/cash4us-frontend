import { useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  ExternalLink,
  FileText,
  Filter,
  Search,
  Video,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import { getResources } from '../../services/resourceService'
import type { Resource, ResourceType } from '../../types/resource'

import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import PageLoader from '../../components/ui/PageLoader'

const resourceTypeLabels: Record<ResourceType, string> = {
  PDF: 'PDF',
  VIDEO: 'Video',
  FLYER: 'Flyer',
  DOCUMENT: 'Document',
  LINK: 'External Link',
}

function getResourceIcon(type: ResourceType) {
  switch (type) {
    case 'VIDEO':
      return Video

    case 'LINK':
      return ExternalLink

    default:
      return FileText
  }
}

function getResourceUrl(resource: Resource): string | null {
  if (resource.resource_type === 'LINK') {
    return resource.external_link || null
  }

  if (resource.resource_file) {
    return resource.resource_file
  }

  return resource.external_link || null
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function ResourcesPage() {
  const { accessToken } = useAuth()

  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'ALL' | ResourceType>('ALL')

  useEffect(() => {
    async function loadResources() {
      if (!accessToken) return

      setIsLoading(true)
      setError('')

      try {
        const data = await getResources(accessToken)
        setResources(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load resources.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadResources()
  }, [accessToken])

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase()

    return resources.filter((resource) => {
      const matchesType =
        filter === 'ALL' || resource.resource_type === filter

      const matchesSearch =
        !query ||
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query)

      return matchesType && matchesSearch
    })
  }, [resources, search, filter])

  function openResource(resource: Resource) {
    const url = getResourceUrl(resource)

    if (!url) return

    window.open(url, '_blank', 'noopener,noreferrer')
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
            <BookOpen size={22} />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Resources
            </h1>

            <p className="text-sm text-slate-500">
              Helpful materials and resources for your Cash4Us journey.
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

      {/* Search and filter */}
      <Card>
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search resources..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div className="relative">
            <Filter
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value as 'ALL' | ResourceType)
              }
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 lg:min-w-[180px]"
            >
              <option value="ALL">All Resources</option>

              {(Object.keys(resourceTypeLabels) as ResourceType[]).map(
                (type) => (
                  <option key={type} value={type}>
                    {resourceTypeLabels[type]}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>
      </Card>

      {/* Resource count */}
      <div className="text-sm text-slate-500">
        {filteredResources.length}{' '}
        {filteredResources.length === 1 ? 'resource' : 'resources'}
      </div>

      {/* Empty state */}
      {!filteredResources.length ? (
        <EmptyState
          title={
            resources.length
              ? 'No resources found'
              : 'No resources available'
          }
          description={
            resources.length
              ? 'Try changing your search or filter.'
              : 'There are currently no resources available.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredResources.map((resource) => {
            const Icon = getResourceIcon(resource.resource_type)
            const url = getResourceUrl(resource)

            return (
              <Card
                key={resource.id}
                className="flex h-full flex-col transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon size={21} />
                  </div>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {resourceTypeLabels[resource.resource_type]}
                  </span>
                </div>

                <div className="mt-4 flex-1">
                  <h2 className="line-clamp-2 text-base font-semibold text-slate-900">
                    {resource.title}
                  </h2>

                  {resource.description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                      {resource.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-400">
                    {formatDate(resource.created_at)}
                  </span>

                  <button
                    type="button"
                    onClick={() => openResource(resource)}
                    disabled={!url}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {resource.resource_type === 'LINK'
                      ? 'Visit Link'
                      : 'Open Resource'}

                    <ExternalLink size={15} />
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}