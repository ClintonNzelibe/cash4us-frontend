import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import {
  getAdminTask,
  updateAdminTaskStatus,
} from '../../../services/adminTaskService'

import type { AdminDailyTask } from '../../../types/admin/tasks'

import TaskStatusBadge from './components/TaskStatusBadge'

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(Number(value))
}

function formatDate(value: string | null) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function InfoItem({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-1 text-sm text-slate-800">
        {value}
      </div>
    </div>
  )
}

export default function AdminTaskDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [task, setTask] =
    useState<AdminDailyTask | null>(null)

  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] =
    useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken || !id) return

    async function loadTask() {
        if (!id || !accessToken) return

        try {
            setLoading(true)
            setError('')

            const response = await getAdminTask(
            id,
            accessToken,
            )

        setTask(response)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load task.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadTask()
  }, [accessToken, id])

  async function toggleStatus() {
    if (!accessToken || !task) return

    try {
      setActionLoading(true)
      setError('')

      await updateAdminTaskStatus(
        task.id,
        !task.is_active,
        accessToken,
      )

      setTask({
        ...task,
        is_active: !task.is_active,
      })
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update task status.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <PageLoader />
  }

  if (error && !task) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    )
  }

  if (!task) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Task not found.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
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
              {task.title}
            </h1>

            <TaskStatusBadge
              isActive={task.is_active}
            />
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Created {formatDate(task.created_at)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/admin/tasks/${task.id}/edit`}
          >
            <Button variant="outline">
              Edit Task
            </Button>
          </Link>

          <Button
            onClick={toggleStatus}
            disabled={actionLoading}
          >
            {actionLoading
              ? 'Updating...'
              : task.is_active
                ? 'Deactivate'
                : 'Activate'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">
            Task Information
          </h2>

          <div className="mt-5 space-y-5">
            <InfoItem
              label="Description"
              value={
                <p className="whitespace-pre-wrap leading-6 text-slate-600">
                  {task.description}
                </p>
              }
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <InfoItem
                label="Reward"
                value={formatCurrency(task.reward)}
              />

              <InfoItem
                label="Points"
                value={task.points}
              />

              <InfoItem
                label="Primary Platform"
                value={task.platform}
              />

              <InfoItem
                label="Required Platforms"
                value={
                  task.required_platforms?.length
                    ? task.required_platforms.join(', ')
                    : '—'
                }
              />

              <InfoItem
                label="Start Date"
                value={task.start_date}
              />

              <InfoItem
                label="End Date"
                value={task.end_date}
              />

              <InfoItem
                label="Deadline"
                value={formatDate(task.deadline)}
              />

              <InfoItem
                label="Assigned At"
                value={formatDate(task.assigned_at)}
              />

              <InfoItem
                label="Submission Count"
                value={task.submission_count}
              />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-slate-900">
            Media
          </h2>

          <div className="mt-5 space-y-5">
            {task.flyer ? (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Flyer
                </p>

                <img
                  src={task.flyer}
                  alt={task.title}
                  className="w-full rounded-xl border border-slate-200 object-cover"
                />
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No flyer attached.
              </p>
            )}

            {task.video && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Video
                </p>

                <a
                  href={task.video}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-emerald-700 hover:underline"
                >
                  Open task video
                </a>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-bold text-slate-900">
          Promotional Content
        </h2>

        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <InfoItem
            label="Advertisement Text"
            value={
              task.advertisement_text ? (
                <div className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 leading-6 text-slate-600">
                  {task.advertisement_text}
                </div>
              ) : (
                '—'
              )
            }
          />

          <InfoItem
            label="Sharing Instructions"
            value={
              task.sharing_instructions ? (
                <div className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 leading-6 text-slate-600">
                  {task.sharing_instructions}
                </div>
              ) : (
                '—'
              )
            }
          />

          <InfoItem
            label="External Link"
            value={
              task.external_link ? (
                <a
                  href={task.external_link}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-emerald-700 hover:underline"
                >
                  {task.external_link}
                </a>
              ) : (
                '—'
              )
            }
          />

          <InfoItem
            label="Promotional Link"
            value={
              task.promotional_link ? (
                <a
                  href={task.promotional_link}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all text-emerald-700 hover:underline"
                >
                  {task.promotional_link}
                </a>
              ) : (
                '—'
              )
            }
          />
        </div>
      </Card>
    </div>
  )
}