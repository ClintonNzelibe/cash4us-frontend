import { useState } from 'react'

interface Props {
  loading?: boolean
  onSubmit: (reply: string) => Promise<void>
}

export default function SupportReplyForm({
  loading = false,
  onSubmit,
}: Props) {
  const [reply, setReply] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const trimmedReply = reply.trim()

    if (!trimmedReply) {
      setError('Please enter a reply.')
      return
    }

    try {
      setError('')
      await onSubmit(trimmedReply)
      setReply('')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to send reply.',
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6"
    >
      <div>
        <h2 className="font-semibold text-slate-900">
          Reply to Ticket
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Send a response to the member.
        </p>
      </div>

      <div className="mt-5">
        <label
          htmlFor="support-reply"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Reply
        </label>

        <textarea
          id="support-reply"
          value={reply}
          onChange={(event) =>
            setReply(event.target.value)
          }
          rows={5}
          placeholder="Write your response..."
          disabled={loading}
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Reply'}
        </button>
      </div>
    </form>
  )
}