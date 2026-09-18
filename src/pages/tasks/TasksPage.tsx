import {
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  FileImage,
  Flame,
  Gift,
  Link as LinkIcon,
  Loader2,
  Send,
  Sparkles,
  Trophy,
  Upload,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  getDailyTasks,
  getTaskStatistics,
  getTaskSubmissions,
  submitTaskProof,
} from '../../services/taskService'
import type {
  DailyTask,
  TaskProofType,
  TaskStatistics,
  TaskSubmission,
} from '../../types/task'

const statusStyles: Record<string, string> = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  APPROVED: 'border-blue-200 bg-blue-50 text-blue-700',
  REJECTED: 'border-red-200 bg-red-50 text-red-700',
  COMPLETED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

function formatMoney(value: string) {
  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return value
  }

  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatDeadline(value: string | null) {
  if (!value) return '24-hour deadline'

  return new Date(value).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getPlatformLabel(platform: string) {
  return platform === 'X'
    ? 'X'
    : platform.replace('_', ' ')
}

function CopyButton({
  value,
  label = 'Copy',
}: {
  value: string
  label?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 1500)
    } catch {
      // Clipboard may not be available.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
    >
      <Copy className="h-3.5 w-3.5" />
      {copied ? 'Copied' : label}
    </button>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: typeof Trophy
  label: string
  value: string | number
  suffix?: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#0F766E]">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">
        {value}
        {suffix && (
          <span className="ml-1 text-sm font-medium text-slate-400">
            {suffix}
          </span>
        )}
      </p>
    </div>
  )
}

function TaskCard({
  task,
  onSubmit,
}: {
  task: DailyTask
  onSubmit: (task: DailyTask) => void
}) {
  const platforms =
    task.required_platforms?.length > 0
      ? task.required_platforms
      : task.platform
        ? [task.platform]
        : []

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300">
      {task.flyer && (
        <div className="aspect-[16/6] overflow-hidden bg-slate-100">
          <img
            src={task.flyer}
            alt={task.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Task heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2.5 flex flex-wrap items-center gap-2">
              {platforms.map((platform) => (
                <span
                  key={platform}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600"
                >
                  {getPlatformLabel(platform)}
                </span>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-[#0F172A]">
              {task.title}
            </h3>

            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-500">
              {task.description}
            </p>
          </div>

          {/* Reward */}
          <div className="shrink-0 rounded-xl bg-emerald-50 px-4 py-3 sm:min-w-[125px] sm:text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
              Reward
            </p>

            <p className="mt-0.5 text-xl font-bold text-[#0F766E]">
              {formatMoney(task.reward)}
            </p>

            {task.points > 0 && (
              <p className="mt-0.5 text-xs font-medium text-emerald-700">
                +{task.points} points
              </p>
            )}
          </div>
        </div>

        {/* Task meta */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-slate-100 py-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-[#0F766E]" />
            <span>
              Complete within 24 hours
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-[#0F766E]" />
            <span>
              {task.points} points
            </span>
          </div>

          {task.deadline && (
            <div className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-[#0F766E]" />
              <span>
                Due {formatDeadline(task.deadline)}
              </span>
            </div>
          )}
        </div>

        {/* Instructions */}
        {task.sharing_instructions && (
          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#0F766E]" />

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Instructions
              </p>
            </div>

            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
              {task.sharing_instructions}
            </p>
          </div>
        )}

        {/* Advertisement */}
        {task.advertisement_text && (
          <div className="mt-4 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Advertisement
              </p>

              <CopyButton
                value={task.advertisement_text}
              />
            </div>

            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
              {task.advertisement_text}
            </p>
          </div>
        )}

        {/* Promotional link */}
        {task.promotional_link && (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#0F766E]">
                <LinkIcon className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700">
                  Promotional link
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {task.promotional_link}
                </p>
              </div>
            </div>

            <CopyButton
              value={task.promotional_link}
              label="Copy link"
            />
          </div>
        )}

        {/* External resources */}
        {(task.external_link || task.video) && (
          <div className="mt-4 flex flex-wrap gap-3">
            {task.external_link && (
              <a
                href={task.external_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open task link
              </a>
            )}

            {task.video && (
              <a
                href={task.video}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View video
              </a>
            )}
          </div>
        )}

        {/* Bottom action */}
        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            Assigned {formatDate(task.assigned_at)}
          </p>

          <button
            type="button"
            onClick={() => onSubmit(task)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
          >
            <Send className="h-4 w-4" />
            Submit Proof
          </button>
        </div>
      </div>
    </article>
  )
}

function SubmissionCard({
  submission,
}: {
  submission: TaskSubmission
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-[#0F172A]">
            {submission.task.title}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Submitted {formatDate(submission.submitted_at)}
          </p>
        </div>

        <span
          className={`w-fit shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold ${
            statusStyles[submission.status] ||
            'border-slate-200 bg-slate-50 text-slate-600'
          }`}
        >
          {submission.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            Proof type
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {submission.proof_type.replace('_', ' ')}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            Reward
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {formatMoney(submission.task.reward)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            Points
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {submission.task.points}
          </p>
        </div>
      </div>

      {submission.admin_comment && (
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Admin comment
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-700">
            {submission.admin_comment}
          </p>
        </div>
      )}
    </div>
  )
}

function SubmitProofModal({
  task,
  token,
  onClose,
  onSuccess,
}: {
  task: DailyTask
  token: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [proofType, setProofType] =
    useState<TaskProofType>('SCREENSHOT')

  const [proofImage, setProofImage] =
    useState<File | undefined>()

  const [proofUrl, setProofUrl] = useState('')
  const [proofDetails, setProofDetails] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault()
    setError('')

    if (proofType === 'SCREENSHOT' && !proofImage) {
      setError('Please upload a screenshot.')
      return
    }

    if (
      proofType === 'POST_URL' &&
      !proofUrl.trim()
    ) {
      setError(
        'Please enter the social media post URL.',
      )
      return
    }

    if (
      proofType === 'OTHER' &&
      !proofDetails.trim()
    ) {
      setError(
        'Please provide details about your proof.',
      )
      return
    }

    try {
      setIsSubmitting(true)

      await submitTaskProof(token, {
        task: task.id,
        proof_type: proofType,
        proof_image: proofImage,
        proof_url: proofUrl.trim(),
        proof_details: proofDetails.trim(),
      })

      onSuccess()
      onClose()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to submit your proof.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0F766E]">
              Daily Task
            </p>

            <h2 className="mt-1 text-lg font-semibold text-[#0F172A]">
              Submit Proof
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {task.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Proof type
            </label>

            <div className="grid gap-2 sm:grid-cols-3">
              {[
                ['SCREENSHOT', 'Screenshot'],
                ['POST_URL', 'Post URL'],
                ['OTHER', 'Other proof'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setProofType(
                      value as TaskProofType,
                    )
                  }
                  className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                    proofType === value
                      ? 'border-[#0F766E] bg-emerald-50 text-[#0F766E]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {proofType === 'SCREENSHOT' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Screenshot
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-6 text-center transition hover:border-[#0F766E] hover:bg-slate-50">
                <Upload className="h-6 w-6 text-slate-400" />

                <span className="mt-2 max-w-full truncate px-4 text-sm font-medium text-slate-700">
                  {proofImage
                    ? proofImage.name
                    : 'Upload your screenshot'}
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  PNG, JPG or JPEG
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                  onChange={(event) =>
                    setProofImage(
                      event.target.files?.[0],
                    )
                  }
                />
              </label>
            </div>
          )}

          {proofType === 'POST_URL' && (
            <div>
              <label
                htmlFor="proof-url"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Social media post URL
              </label>

              <input
                id="proof-url"
                type="url"
                value={proofUrl}
                onChange={(event) =>
                  setProofUrl(event.target.value)
                }
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          )}

          {proofType === 'OTHER' && (
            <div>
              <label
                htmlFor="proof-details"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Proof details
              </label>

              <textarea
                id="proof-details"
                value={proofDetails}
                onChange={(event) =>
                  setProofDetails(event.target.value)
                }
                rows={5}
                placeholder="Describe the proof you are submitting..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          )}

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex gap-3">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#0F766E]" />

              <div>
                <p className="text-sm font-medium text-slate-700">
                  Submission deadline
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {formatDeadline(task.deadline)}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Proof
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function TasksPage() {
  const { accessToken } = useAuth()

  const [tasks, setTasks] = useState<DailyTask[]>([])
  const [submissions, setSubmissions] =
    useState<TaskSubmission[]>([])
  const [statistics, setStatistics] =
    useState<TaskStatistics | null>(null)

  const [selectedTask, setSelectedTask] =
    useState<DailyTask | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    if (!accessToken) return

    try {
      setIsLoading(true)
      setError('')

      const [
        tasksData,
        submissionsData,
        statisticsData,
      ] = await Promise.all([
        getDailyTasks(accessToken),
        getTaskSubmissions(accessToken),
        getTaskStatistics(accessToken),
      ])

      setTasks(tasksData)
      setSubmissions(submissionsData)
      setStatistics(statisticsData)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load daily tasks.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [accessToken])

  const submittedTaskIds = useMemo(
    () =>
      new Set(
        submissions.map(
          (submission) => submission.task.id,
        ),
      ),
    [submissions],
  )

  const availableTasks = useMemo(
    () =>
      tasks.filter(
        (task) => !submittedTaskIds.has(task.id),
      ),
    [tasks, submittedTaskIds],
  )

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px]">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-40 rounded-lg bg-slate-200" />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 rounded-2xl bg-white"
              />
            ))}
          </div>

          <div className="h-32 rounded-2xl bg-white" />
          <div className="h-72 rounded-2xl bg-white" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1280px] space-y-7">
      {/* Header */}
      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#0F766E]">
              Earn more with daily activities
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A]">
              Daily Tasks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete your assigned tasks and submit proof
              to earn rewards.
            </p>
          </div>

          {availableTasks.length > 0 && (
            <div className="flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#0F766E]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {availableTasks.length}{' '}
              {availableTasks.length === 1
                ? 'task'
                : 'tasks'}{' '}
              available
            </div>
          )}
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Statistics */}
      {statistics && (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Trophy}
              label="Completion rate"
              value={
                statistics.overall_completion_rate
              }
              suffix="%"
            />

            <StatCard
              icon={Flame}
              label="Current streak"
              value={statistics.daily_task_streak}
              suffix={
                statistics.daily_task_streak === 1
                  ? 'day'
                  : 'days'
              }
            />

            <StatCard
              icon={CheckCircle2}
              label="Tasks completed"
              value={statistics.tasks_completed}
            />

            <StatCard
              icon={Clock3}
              label="Tasks missed"
              value={statistics.tasks_missed}
            />
          </section>

          {/* Progress */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#0F766E]">
                  <Sparkles className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">
                    Completion progress
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Minimum required:{' '}
                    {
                      statistics.minimum_completion_threshold
                    }
                    %
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#0F172A]">
                  {statistics.overall_completion_rate}%
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    statistics.meets_minimum_completion_threshold
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {statistics.meets_minimum_completion_threshold
                    ? 'Requirement met'
                    : 'Not yet met'}
                </span>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#0F766E] transition-all"
                style={{
                  width: `${Math.min(
                    statistics.overall_completion_rate,
                    100,
                  )}%`,
                }}
              />
            </div>
          </section>
        </>
      )}

      {/* Available tasks */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Available Tasks
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Complete these activities within the required
              time.
            </p>
          </div>
        </div>

        {availableTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
              <Gift className="h-6 w-6 text-slate-300" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#0F172A]">
              No available tasks
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              You have completed or submitted all currently
              available tasks.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {availableTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onSubmit={setSelectedTask}
              />
            ))}
          </div>
        )}
      </section>

      {/* Submissions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            My Submissions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track the status of your submitted proofs.
          </p>
        </div>

        {submissions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
              <FileImage className="h-6 w-6 text-slate-300" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#0F172A]">
              No submissions yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your submitted proofs will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {submissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
              />
            ))}
          </div>
        )}
      </section>

      {/* Submit modal */}
      {selectedTask && accessToken && (
        <SubmitProofModal
          task={selectedTask}
          token={accessToken}
          onClose={() => setSelectedTask(null)}
          onSuccess={() => {
            void loadData()
          }}
        />
      )}
    </div>
  )
}