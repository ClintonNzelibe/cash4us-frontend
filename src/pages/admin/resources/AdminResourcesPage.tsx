import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'
import { useAuth } from '../../../context/AuthContext'

import { getAdminResources } from '../../../services/adminResourceService'

import type {
  AdminResource,
  ResourceFilters,
} from '../../../types/admin/resources'

import ResourceStatusBadge from './components/ResourceStatusBadge'
import ResourceFiltersComponent from './components/ResourceFilters'

export default function AdminResourcesPage() {
  const { accessToken } = useAuth()

  const [resources, setResources] =
    useState<AdminResource[]>([])

  const [filters, setFilters] =
    useState<ResourceFilters>({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadResources = async () => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await getAdminResources(
        accessToken,
        filters,
      )

      setResources(
        Array.isArray(response)
          ? response
          : response.results || [],
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load resources.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResources()
  }, [accessToken, filters])

  if (loading) {
    return <PageLoader />
  }

  const activeCount = resources.filter(
    (resource) => resource.is_active,
  ).length

  const inactiveCount = resources.filter(
    (resource) => !resource.is_active,
  ).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Resources
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage learning resources available to members.
          </p>
        </div>

        <Link
          to="/admin/resources/create"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          + Add Resource
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Active Resources
            </p>

            <p className="mt-2 text-2xl font-semibold text-emerald-700">
              {activeCount}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Inactive Resources
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-600">
              {inactiveCount}
            </p>
          </div>
        </Card>
      </div>

      <ResourceFiltersComponent
        filters={filters}
        onChange={setFilters}
      />

      {error && (
        <Card>
          <div className="flex items-center justify-between gap-4 p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadResources}
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Retry
            </button>
          </div>
        </Card>
      )}

      <Card>
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Resource Library
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {resources.length} resource
            {resources.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Resource
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Uploaded By
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Created
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {resources.map((resource) => (
                <tr
                  key={resource.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">
                      {resource.title}
                    </p>

                    <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                      {resource.description || 'No description'}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">
                      {resource.resource_type}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700">
                      {resource.uploaded_by_details?.username ||
                        '—'}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {resource.uploaded_by_details?.email ||
                        '—'}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <ResourceStatusBadge
                      isActive={resource.is_active}
                    />
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(
                      resource.created_at,
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/admin/resources/${resource.id}`}
                      className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {resources.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      No resources found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Add a resource to begin building the
                      member resource library.
                    </p>
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