import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'
import { useAuth } from '../../../context/AuthContext'

import {
  closeAdminSupportTicket,
  getAdminSupportTicket,
  replyToAdminSupportTicket,
} from '../../../services/adminSupportService'

import type {
  AdminSupportTicket,
} from '../../../types/admin/support'

import SupportTicketStatusBadge from './components/SupportTicketStatusBadge'
import SupportReplyForm from './components/SupportReplyForm'
import SupportTicketActionModal from './components/SupportTicketActionModal'

export default function AdminSupportTicketDetailsPage() {
  const { id } = useParams<{ id: string }>()
  
  const { accessToken } = useAuth()

  const [ticket, setTicket] =
    useState<AdminSupportTicket | null>(null)

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] =
    useState(false)

  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  const [showCloseModal, setShowCloseModal] =
    useState(false)

  const loadTicket = async () => {
    if (!accessToken || !id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response =
        await getAdminSupportTicket(
          accessToken,
          id,
        )

      setTicket(response)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load support ticket.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTicket()
  }, [accessToken, id])

  const handleReply = async (reply: string) => {
    if (!accessToken || !id) {
      return
    }

    setActionLoading(true)
    setActionError('')

    try {
      const updatedTicket =
        await replyToAdminSupportTicket(
          accessToken,
          id,
          { reply },
        )

      setTicket(updatedTicket)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to send reply.'

      setActionError(message)
      throw new Error(message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleClose = async () => {
    if (!accessToken || !id) {
      return
    }

    try {
      setActionLoading(true)
      setActionError('')

      const updatedTicket =
        await closeAdminSupportTicket(
          accessToken,
          id,
        )

      setTicket(updatedTicket)
      setShowCloseModal(false)
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Failed to close support ticket.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <PageLoader />
  }

  if (error || !ticket) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/support"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Support
        </Link>

        <Card>
          <div className="p-6">
            <p className="text-sm text-red-600">
              {error || 'Support ticket not found.'}
            </p>
          </div>
        </Card>
      </div>
    )
  }

  const canReply =
    ticket.status !== 'CLOSED'

  const canClose =
    ticket.status !== 'CLOSED'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/admin/support"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            ← Back to Support
          </Link>

          <h1 className="mt-3 text-2xl font-semibold text-slate-900">
            {ticket.subject}
          </h1>

          <div className="mt-2">
            <SupportTicketStatusBadge
              status={ticket.status}
            />
          </div>
        </div>

        {canClose && (
          <button
            type="button"
            onClick={() =>
              setShowCloseModal(true)
            }
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Close Ticket
          </button>
        )}
      </div>

      {actionError && (
        <Card>
          <div className="p-4">
            <p className="text-sm text-red-600">
              {actionError}
            </p>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Member Message
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(
                      ticket.created_at,
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {ticket.message}
              </div>
            </div>
          </Card>

          {ticket.reply && (
            <Card>
              <div className="p-6">
                <h2 className="font-semibold text-slate-900">
                  Admin Reply
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Last updated{' '}
                  {new Date(
                    ticket.updated_at,
                  ).toLocaleString()}
                </p>

                <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {ticket.reply}
                </div>
              </div>
            </Card>
          )}

          {canReply && (
            <SupportReplyForm
              loading={actionLoading}
              onSubmit={handleReply}
            />
          )}
        </div>

        <Card>
          <div className="p-6">
            <h2 className="font-semibold text-slate-900">
              Member Details
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Username
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {ticket.member.username}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-1 break-all text-sm text-slate-700">
                  {ticket.member.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Membership Code
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {ticket.member.membership_code ||
                    '—'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Ticket ID
                </p>

                <p className="mt-1 break-all text-xs text-slate-500">
                  {ticket.id}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <SupportTicketActionModal
        open={showCloseModal}
        loading={actionLoading}
        title="Close Support Ticket"
        message="Are you sure you want to close this support ticket? The ticket will be marked as closed."
        confirmLabel="Close Ticket"
        onConfirm={handleClose}
        onCancel={() =>
          setShowCloseModal(false)
        }
      />
    </div>
  )
}