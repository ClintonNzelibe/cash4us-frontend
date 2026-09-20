import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { useAuth } from '../../../context/AuthContext'
import { getAdminAuditLog } from '../../../services/adminAuditService'
import type { AdminAuditLog } from '../../../types/admin/audit'

import AuditActionBadge from './components/AuditActionBadge'

export default function AdminAuditLogDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()

  const [log, setLog] = useState<AdminAuditLog | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadLog = useCallback(async () => {
    if (!accessToken || !id) {
      return
    }

    try {
      setLoading(true)
      setError('')

      const data = await getAdminAuditLog(
        accessToken,
        id,
      )

      setLog(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load audit log.',
      )
    } finally {
      setLoading(false)
    }
  }, [accessToken, id])

  useEffect(() => {
    void loadLog()
  }, [loadLog])

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Loading audit log...
      </div>
    )
  }

  if (error || !log) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/audit"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Audit Logs
        </Link>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || 'Audit log not found.'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin/audit"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Audit Logs
        </Link>

        <div className="mt-4 flex flex-col justify-between gap-3 md:flex-row md:items-start">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Audit Log Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Administrative activity record.
            </p>
          </div>

          <AuditActionBadge action={log.action} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">
            Administrator
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Username
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {log.admin_details.username}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {log.admin_details.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Admin ID
              </p>

              <p className="mt-1 break-all text-xs text-slate-500">
                {log.admin_details.id}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900">
            Activity
          </h2>

          <div className="mt-5 space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Description
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-700">
                {log.description}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Action
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {log.action}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Resource Type
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {log.resource_type}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Resource ID
                </p>

                <p className="mt-1 break-all text-xs text-slate-500">
                  {log.resource_id}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {new Date(
                    log.created_at,
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-base font-semibold text-slate-900">
          Metadata
        </h2>

        {log.metadata &&
        Object.keys(log.metadata).length > 0 ? (
          <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-950 p-5 text-sm leading-6 text-slate-200">
            {JSON.stringify(log.metadata, null, 2)}
          </pre>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            No metadata recorded.
          </p>
        )}
      </div>
    </div>
  )
}