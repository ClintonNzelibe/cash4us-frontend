import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Card from '../../../components/ui/Card'

import { useAuth } from '../../../context/AuthContext'

import { createAdminCommunityPool } from '../../../services/adminCommunityService'

import type { CommunityPoolFormData } from '../../../types/admin/community'

import CommunityPoolForm from '../../../pages/admin/community/components/CommunityPoolForm'

export default function AdminCommunityPoolCreatePage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (
    data: CommunityPoolFormData,
  ) => {
    if (!accessToken) {
      setError('Authentication required.')
      return
    }

    try {
      setSaving(true)
      setError('')

      const pool = await createAdminCommunityPool(
        accessToken,
        data,
      )

      navigate(`/admin/community/pools/${pool.id}`)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create community pool.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() =>
            navigate('/admin/community/pools')
          }
          className="mb-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Community Pools
        </button>

        <h1 className="text-2xl font-semibold text-slate-900">
          Create Community Pool
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a new community earnings pool.
        </p>
      </div>

      {error && (
        <Card>
          <div className="p-4 text-sm text-red-600">
            {error}
          </div>
        </Card>
      )}

      <Card>
        <div className="p-6">
          <CommunityPoolForm
            onSubmit={handleSubmit}
            submitLabel="Create Pool"
            loading={saving}
          />
        </div>
      </Card>
    </div>
  )
}