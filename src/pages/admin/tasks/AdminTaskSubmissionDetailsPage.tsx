import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'
import { useAuth } from '../../../context/AuthContext'
import {
  approveAdminTaskSubmission,
  getAdminTaskSubmission,
  rejectAdminTaskSubmission,
} from '../../../services/adminTaskService'
import type { AdminTaskSubmission } from '../../../types/admin/tasks'

import SubmissionActionModal from './components/SubmissionActionModal'
import SubmissionProofModal from './components/SubmissionProofModal'
import TaskSubmissionStatusBadge from './components/TaskSubmissionStatusBadge'

function formatDate(value: string | null) {
  if (!value) return '—'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('en-NG', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
}

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(Number(value))
}

export default function AdminTaskSubmissionDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { accessToken } = useAuth()
  const [submission, setSubmission] =
    useState<AdminTaskSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [action, setAction] =
    useState<'approve' | 'reject' | null>(null)
  const [showProof, setShowProof] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!accessToken || !id) return

    const submissionId: string = id
    const authToken: string = accessToken

    async function loadSubmission() {
      try {
        setLoading(true)
        setError('')
        setSubmission(
          await getAdminTaskSubmission(submissionId, authToken),
        )
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load this submission.',
        )
      } finally {
        setLoading(false)
      }
    }

    void loadSubmission()
  }, [accessToken, id])

  async function handleAction(adminComment: string) {
    if (!accessToken || !submission || !action) return

    try {
      setIsProcessing(true)
      setActionError('')
      const response = action === 'approve'
        ? await approveAdminTaskSubmission(
          submission.id,
          accessToken,
          adminComment,
        )
        : await rejectAdminTaskSubmission(
          submission.id,
          accessToken,
          adminComment,
        )

      setSubmission(response.submission)
      setAction(null)
    } catch (processError) {
      setActionError(
        processError instanceof Error
          ? processError.message
          : 'Unable to process this submission.',
      )
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) return <PageLoader />

  if (error || !submission) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error || 'Task submission not found.'}
      </div>
    )
  }

  const canReview = submission.status === 'PENDING'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate('/admin/tasks')}
            className="mb-3 text-sm font-medium text-emerald-700 hover:underline"
          >
            ← Back to Tasks
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              Task Submission
            </h1>
            <TaskSubmissionStatusBadge status={submission.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Submitted {formatDate(submission.submitted_at)}
          </p>
        </div>

        {canReview && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setAction('reject')}>
              Reject
            </Button>
            <Button onClick={() => setAction('approve')}>
              Approve & complete
            </Button>
          </div>
        )}
      </div>

      <Card className="p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Member</p>
            <p className="mt-1 font-medium text-slate-800">{submission.member.username}</p>
            <p className="text-sm text-slate-500">{submission.member.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Task</p>
            <p className="mt-1 font-medium text-slate-800">{submission.task.title}</p>
            <p className="text-sm text-slate-500">
              {formatCurrency(submission.task.reward)} · {submission.task.points} points
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Verification</p>
            <p className="mt-1 text-sm font-medium text-slate-800">
              {submission.requires_admin_review ? 'Admin review required' : 'No review flag'}
            </p>
            <p className="text-sm text-slate-500">
              {submission.ai_result || 'No automated result'}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Submitted proof</h2>
            <p className="mt-1 text-sm text-slate-500">
              {submission.proof_type.replace('_', ' ')}
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowProof(true)}>
            View proof
          </Button>
        </div>

        {submission.proof_image && (
          <img
            src={submission.proof_image}
            alt="Task submission proof preview"
            className="mt-5 max-h-80 w-full rounded-xl border border-slate-200 object-contain"
          />
        )}
        {submission.proof_url && (
          <a
            href={submission.proof_url}
            target="_blank"
            rel="noreferrer"
            className="mt-5 block break-all text-sm font-medium text-emerald-700 hover:underline"
          >
            {submission.proof_url}
          </a>
        )}
      </Card>

      {submission.admin_comment && (
        <Card className="p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-slate-900">Admin comment</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
            {submission.admin_comment}
          </p>
        </Card>
      )}

      <SubmissionProofModal
        open={showProof}
        proofType={submission.proof_type}
        proofImage={submission.proof_image}
        proofUrl={submission.proof_url}
        proofDetails={submission.proof_details}
        onClose={() => setShowProof(false)}
      />
      <SubmissionActionModal
        open={action !== null}
        action={action}
        loading={isProcessing}
        error={actionError}
        onClose={() => {
          if (!isProcessing) {
            setAction(null)
            setActionError('')
          }
        }}
        onConfirm={handleAction}
      />
    </div>
  )
}
