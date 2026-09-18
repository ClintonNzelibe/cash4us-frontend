import { useEffect, useState } from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import {
  getAdminTask,
  updateAdminTask,
} from '../../../services/adminTaskService'

import type {
  AdminDailyTask,
  AdminDailyTaskPayload,
} from '../../../types/admin/tasks'

import TaskForm from './components/TaskForm'

export default function AdminTaskEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [task, setTask] =
    useState<AdminDailyTask | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  async function handleSubmit(
    payload: AdminDailyTaskPayload,
  ) {
    if (!accessToken || !id) {
      setError('Authentication or task ID is missing.')
      return
    }

    try {
      setSaving(true)
      setError('')

      await updateAdminTask(
        id,
        payload,
        accessToken,
      )

      navigate(`/admin/tasks/${id}`)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update task.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <PageLoader />
  }

  if (!task) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error || 'Task not found.'}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() =>
            navigate(`/admin/tasks/${task.id}`)
          }
          className="mb-3 text-sm font-medium text-emerald-700 hover:underline"
        >
          ← Back to Task
        </button>

        <h1 className="text-2xl font-bold text-slate-900">
          Edit Task
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update {task.title}.
        </p>
      </div>

      <Card>
        <TaskForm
          initialData={task}
          loading={saving}
          error={error}
          submitLabel="Update Task"
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate(`/admin/tasks/${task.id}`)
          }
        />
      </Card>
    </div>
  )
}