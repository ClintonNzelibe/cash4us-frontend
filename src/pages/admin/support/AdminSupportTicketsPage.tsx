import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'
import { useAuth } from '../../../context/AuthContext'

import {
  getAdminSupportTickets,
} from '../../../services/adminSupportService'

import type {
  AdminSupportTicket,
  SupportTicketFilters,
} from '../../../types/admin/support'

import SupportTicketStatusBadge from './components/SupportTicketStatusBadge'


export default function AdminSupportTicketsPage() {
  const { accessToken } = useAuth()

  const [tickets, setTickets] = useState<
    AdminSupportTicket[]
  >([])

  const [filters] =
    useState<SupportTicketFilters>({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTickets = async () => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response =
        await getAdminSupportTickets(
          accessToken,
          filters,
        )

      setTickets(
        Array.isArray(response)
          ? response
          : response.results || [],
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load support tickets.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [accessToken, filters])

  if (loading) {
    return <PageLoader />
  }

  const openCount = tickets.filter(
    (ticket) => ticket.status === 'OPEN',
  ).length

  const repliedCount = tickets.filter(
    (ticket) => ticket.status === 'REPLIED',
  ).length

  const closedCount = tickets.filter(
    (ticket) => ticket.status === 'CLOSED',
  ).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Support Tickets
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage member support requests and responses.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Open
            </p>

            <p className="mt-2 text-2xl font-semibold text-amber-600">
              {openCount}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Replied
            </p>

            <p className="mt-2 text-2xl font-semibold text-blue-600">
              {repliedCount}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <p className="text-sm text-slate-500">
              Closed
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-600">
              {closedCount}
            </p>
          </div>
        </Card>
      </div>

      

      {error && (
        <Card>
          <div className="flex items-center justify-between gap-4 p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadTickets}
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
            Tickets
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {tickets.length} ticket
            {tickets.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Subject
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Member
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
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">
                      {ticket.subject}
                    </p>

                    <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                      {ticket.message}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-700">
                      {ticket.member.username}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {ticket.member.email}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <SupportTicketStatusBadge
                      status={ticket.status}
                    />
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(
                      ticket.created_at,
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/admin/support/${ticket.id}`}
                      className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {tickets.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      No support tickets found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      There are no tickets matching the
                      current filters.
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