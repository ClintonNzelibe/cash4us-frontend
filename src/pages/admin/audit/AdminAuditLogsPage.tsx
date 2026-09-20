import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'

import { useAuth } from '../../../context/AuthContext'
import { getAdminAuditLogs } from '../../../services/adminAuditService'
import type {
  AdminAuditLog,
  AuditLogFilters as AuditFilterValues,
} from '../../../types/admin/audit'

import AuditActionBadge from './components/AuditActionBadge'
import AuditLogFilters from './components/AuditLogFilters'

export default function AdminAuditLogsPage() {
  const { accessToken } = useAuth()

  const [logs, setLogs] = useState<AdminAuditLog[]>([])
  const [filters, setFilters] =
    useState<AuditFilterValues>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadLogs = useCallback(async () => {
    if (!accessToken) {
      return
    }

    try {
      setLoading(true)
      setError('')

      const data = await getAdminAuditLogs(
        accessToken,
        filters,
      )

      setLogs(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load audit logs.',
      )
    } finally {
      setLoading(false)
    }
  }, [accessToken, filters])

  useEffect(() => {
    void loadLogs()
  }, [loadLogs])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Audit Logs
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review administrative actions across Cash4Us.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadLogs()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />
          Refresh
        </button>
      </div>

      <AuditLogFilters
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
                  Action
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Admin
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Resource
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Description
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
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
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    Loading audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <AuditActionBadge action={log.action} />
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-900">
                        {log.admin_details.username}
                      </p>

                      <p className="text-xs text-slate-500">
                        {log.admin_details.email}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {log.resource_type}
                      </p>

                      <p className="mt-1 max-w-[180px] truncate text-xs text-slate-400">
                        {log.resource_id}
                      </p>
                    </td>

                    <td className="max-w-sm px-5 py-4">
                      <p className="truncate text-sm text-slate-600">
                        {log.description}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {new Date(
                        log.created_at,
                      ).toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/admin/audit/${log.id}`}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}