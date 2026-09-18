import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Card from '../../../components/ui/Card'

import { useAuth } from '../../../context/AuthContext'

import {
  createAdminAward,
} from '../../../services/adminRewardService'

import type { AwardFormData } from '../../../types/admin/rewards'

import AwardForm from './components/AwardForm'

export default function AdminAwardCreatePage() {
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(data: AwardFormData) {
    if (!accessToken) return

    try {
      setSubmitting(true)
      setError('')

      const award = await createAdminAward(
        data,
        accessToken,
      )

      navigate(
        `/admin/rewards/awards/${award.id}`,
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create award.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link
        to="/admin/rewards/awards"
        className="text-sm font-semibold text-emerald-700"
      >
        ← Back to Awards
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Create Award
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a new member achievement award.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <AwardForm
          submitting={submitting}
          onSubmit={submit}
        />
      </Card>
    </div>
  )
}