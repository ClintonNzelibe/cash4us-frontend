import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  Clock3,
  Headphones,
  MessageCircle,
  Plus,
  Send,
  X,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import {
  createSupportTicket,
  getSupportTickets,
} from '../../services/supportService'

import type { SupportTicket } from '../../types/support'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getStatusStyles(status: SupportTicket['status']) {
  switch (status) {
    case 'OPEN':
      return 'bg-amber-50 text-amber-700 border-amber-200'

    case 'REPLIED':
      return 'bg-blue-50 text-blue-700 border-blue-200'

    case 'CLOSED':
      return 'bg-slate-100 text-slate-600 border-slate-200'

    default:
      return 'bg-slate-100 text-slate-600 border-slate-200'
  }
}

function getStatusLabel(status: SupportTicket['status']) {
  switch (status) {
    case 'OPEN':
      return 'Open'

    case 'REPLIED':
      return 'Replied'

    case 'CLOSED':
      return 'Closed'

    default:
      return status
  }
}

export default function SupportPage() {
  const { accessToken } = useAuth()

  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTicket, setSelectedTicket] =
    useState<SupportTicket | null>(null)

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadTickets() {
    if (!accessToken) return

    try {
      setIsLoading(true)
      setError('')

      const data = await getSupportTickets(accessToken)
      setTickets(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load your support tickets.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [accessToken])

  const stats = useMemo(() => {
    const open = tickets.filter(
      (ticket) => ticket.status === 'OPEN',
    ).length

    const replied = tickets.filter(
      (ticket) => ticket.status === 'REPLIED',
    ).length

    const closed = tickets.filter(
      (ticket) => ticket.status === 'CLOSED',
    ).length

    return {
      total: tickets.length,
      open,
      replied,
      closed,
    }
  }, [tickets])

  function resetForm() {
    setSubject('')
    setMessage('')
    setError('')
  }

  function closeCreateModal() {
    if (isCreating) return

    resetForm()
    setShowCreateModal(false)
  }

  async function handleCreateTicket() {
    if (!accessToken) {
      setError('Your session has expired. Please log in again.')
      return
    }

    if (!subject.trim()) {
      setError('Please enter a subject.')
      return
    }

    if (!message.trim()) {
      setError('Please describe your issue.')
      return
    }

    try {
      setIsCreating(true)
      setError('')
      setSuccess('')

      const ticket = await createSupportTicket(
        accessToken,
        {
          subject: subject.trim(),
          message: message.trim(),
        },
      )

      setTickets((current) => [ticket, ...current])

      setSuccess('Your support ticket has been submitted.')
      resetForm()
      setShowCreateModal(false)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to submit your support ticket.',
      )
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#0F766E]">
            Help Center
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">
            Support
          </h2>

          <p className="mt-1 text-sm text-[#64748B]">
            Get help from the Cash4Us support team.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError('')
            setSuccess('')
            setShowCreateModal(true)
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#115E59]"
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          {success}
        </div>
      )}

      {error && !showCreateModal && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">
            Total Tickets
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            {stats.total}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">
            Open
          </p>

          <p className="mt-1 text-xl font-bold text-amber-600">
            {stats.open}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">
            Replied
          </p>

          <p className="mt-1 text-xl font-bold text-blue-600">
            {stats.replied}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">
            Closed
          </p>

          <p className="mt-1 text-xl font-bold text-slate-600">
            {stats.closed}
          </p>
        </div>
      </div>

      {/* Tickets */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F766E]/10 text-[#0F766E]">
            <Headphones className="h-4 w-4" />
          </div>

          <div>
            <h3 className="font-semibold text-[#0F172A]">
              My Support Tickets
            </h3>

            <p className="text-xs text-slate-500">
              Track your support requests and replies.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl border border-slate-100 p-4"
              >
                <div className="h-4 w-1/3 rounded bg-slate-200" />
                <div className="mt-3 h-3 w-2/3 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="px-5 py-12 text-center sm:px-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <MessageCircle className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              No support tickets yet
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              If you need help, create a support ticket and our team
              will get back to you.
            </p>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#115E59]"
            >
              <Plus className="h-4 w-4" />
              Create Ticket
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                onClick={() => setSelectedTicket(ticket)}
                className="w-full px-5 py-4 text-left transition hover:bg-slate-50 sm:px-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="truncate text-sm font-semibold text-slate-900">
                        {ticket.subject}
                      </h4>

                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getStatusStyles(ticket.status)}`}
                      >
                        {getStatusLabel(ticket.status)}
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                      {ticket.message}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-400">
                    <Clock3 className="h-3.5 w-3.5" />
                    {formatDate(ticket.created_at)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Create Support Ticket
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Tell us how we can help.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateModal}
                disabled={isCreating}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Subject
                </label>

                <input
                  type="text"
                  value={subject}
                  onChange={(event) =>
                    setSubject(event.target.value)
                  }
                  placeholder="What do you need help with?"
                  disabled={isCreating}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 disabled:bg-slate-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Message
                </label>

                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder="Describe your issue or question..."
                  rows={6}
                  disabled={isCreating}
                  className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 disabled:bg-slate-50"
                />
              </div>

              <button
                type="button"
                onClick={handleCreateTicket}
                disabled={isCreating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />

                {isCreating
                  ? 'Submitting...'
                  : 'Submit Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
              <div className="min-w-0 pr-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-slate-900">
                    {selectedTicket.subject}
                  </h3>

                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getStatusStyles(selectedTicket.status)}`}
                  >
                    {getStatusLabel(selectedTicket.status)}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Created {formatDateTime(selectedTicket.created_at)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Your Message
                </p>

                <div className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {selectedTicket.message}
                </div>
              </div>

              {selectedTicket.reply ? (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
                    Support Reply
                  </p>

                  <div className="rounded-xl border border-[#0F766E]/10 bg-[#0F766E]/5 p-4 text-sm leading-6 text-slate-700">
                    {selectedTicket.reply}
                  </div>

                  {selectedTicket.replied_at && (
                    <p className="mt-2 text-xs text-slate-400">
                      Replied {formatDateTime(selectedTicket.replied_at)}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      Awaiting response
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-700">
                      Our support team has not replied to this ticket yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}