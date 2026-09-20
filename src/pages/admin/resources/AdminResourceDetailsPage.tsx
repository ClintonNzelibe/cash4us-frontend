import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'
import { useAuth } from '../../../context/AuthContext'

import {
  getAdminResource,
  updateAdminResourceStatus,
} from '../../../services/adminResourceService'

import type {
  AdminResource,
} from '../../../types/admin/resources'

import ResourceStatusBadge from './components/ResourceStatusBadge'
import ResourceActionModal from './components/ResourceActionModal'

export default function AdminResourceDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()

  const [resource, setResource] =
    useState<AdminResource | null>(null)

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] =
    useState(false)
  const [error, setError] = useState('')

  const [showStatusModal, setShowStatusModal] =
    useState(false)

  const loadResource = async () => {
    if (!accessToken || !id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response =
        await getAdminResource(
          accessToken,
          id,
        )

      setResource(response)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load resource.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResource()
  }, [accessToken, id])

  const handleStatusChange = async () => {
    if (!accessToken || !id || !resource) {
      return
    }

    try {
      setActionLoading(true)

      const updated =
        await updateAdminResourceStatus(
          accessToken,
          id,
          {
            is_active: !resource.is_active,
          },
        )

      setResource(updated)
      setShowStatusModal(false)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update resource status.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <PageLoader />
  }

  if (!resource) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/resources"
          className="text-sm font-medium text-emerald-700"
        >
          ← Back to Resources
        </Link>

        <Card>
          <div className="p-6">
            <p className="text-sm text-red-600">
              {error || 'Resource not found.'}
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/admin/resources"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            ← Back to Resources
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">
              {resource.title}
            </h1>

            <ResourceStatusBadge
              isActive={resource.is_active}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to={`/admin/resources/${resource.id}/edit`}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={() =>
              setShowStatusModal(true)
            }
            className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
          >
            {resource.is_active
              ? 'Deactivate'
              : 'Activate'}
          </button>
        </div>
      </div>

      {error && (
        <Card>
          <div className="p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <div className="p-6">
            <h2 className="font-semibold text-slate-900">
              Resource Details
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Type
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {resource.resource_type}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {new Date(
                    resource.created_at,
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Updated
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {new Date(
                    resource.updated_at,
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Uploaded By
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {resource.uploaded_by_details?.username ||
                    '—'}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {resource.uploaded_by_details?.email ||
                    '—'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="p-6">
              <h2 className="font-semibold text-slate-900">
                Description
              </h2>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {resource.description ||
                  'No description provided.'}
              </p>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="font-semibold text-slate-900">
                Resource
              </h2>

              <div className="mt-4">
                {resource.external_link ? (
                  <a
                    href={resource.external_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    Open External Link →
                  </a>
                ) : resource.resource_file ? (
                  <a
                    href={resource.resource_file}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    Open Resource File →
                  </a>
                ) : (
                  <p className="text-sm text-slate-500">
                    No resource file or external link
                    available.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ResourceActionModal
        open={showStatusModal}
        loading={actionLoading}
        title={
          resource.is_active
            ? 'Deactivate Resource'
            : 'Activate Resource'
        }
        message={
          resource.is_active
            ? 'This resource will no longer appear in the active member resource library.'
            : 'This resource will become active and available to members.'
        }
        confirmLabel={
          resource.is_active
            ? 'Deactivate'
            : 'Activate'
        }
        onConfirm={handleStatusChange}
        onCancel={() =>
          setShowStatusModal(false)
        }
      />
    </div>
  )
}