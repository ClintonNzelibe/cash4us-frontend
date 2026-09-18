import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import {
  getAdminAward,
  updateAdminAward,
} from '../../../services/adminRewardService'

import type {
  AdminAward,
  AwardFormData,
} from '../../../types/admin/rewards'

import AwardForm from './components/AwardForm'

export default function AdminAwardEditPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const [award, setAward] =
    useState<AdminAward | null>(null)

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken || !id) {
      setLoading(false)
      return
    }

    async function load() {
      if (!id || !accessToken) return

      try {
        setAward(
          await getAdminAward(
            id,
            accessToken,
          ),
        )
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load award.',
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [accessToken, id])

  async function submit(data: AwardFormData) {
    if (!accessToken || !id) return

    try {
      setSubmitting(true)
      setError('')

      await updateAdminAward(
        id,
        data,
        accessToken,
      )

      navigate(
        `/admin/rewards/awards/${id}`,
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update award.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <Link
        to={
          id
            ? `/admin/rewards/awards/${id}`
            : '/admin/rewards/awards'
        }
        className="text-sm font-semibold text-emerald-700"
      >
        ← Back to Award
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Edit Award
        </h1>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!award ? (
        <Card>
          <p className="text-sm text-slate-500">
            Award not found.
          </p>
        </Card>
      ) : (
        <Card>
          <AwardForm
            initialData={award}
            submitting={submitting}
            onSubmit={submit}
          />
        </Card>
      )}
    </div>
  )
}