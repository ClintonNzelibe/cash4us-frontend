import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Card from '../../../components/ui/Card'

import { useAuth } from '../../../context/AuthContext'

import { createAdminTask } from '../../../services/adminTaskService'

import type { AdminDailyTaskPayload } from '../../../types/admin/tasks'

import TaskForm from './components/TaskForm'

export default function AdminTaskCreatePage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(
    payload: AdminDailyTaskPayload,
  ) {
    if (!accessToken) {
      setError('Authentication token is missing.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const task = await createAdminTask(
        payload,
        accessToken,
      )

      navigate(`/admin/tasks/${task.id}`)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create task.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Create Task
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a new daily promotional task.
        </p>
      </div>

      <Card>
        <TaskForm
          loading={loading}
          error={error}
          submitLabel="Create Task"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/tasks')}
        />
      </Card>
    </div>
  )
}