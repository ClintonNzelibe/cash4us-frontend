import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import {
  createAdminAdvertisingRevenue,
  getAdminCampaigns,
} from '../../../services/adminAdvertisingService'

import type {
  AdminCampaign,
  RevenueFormData,
} from '../../../types/admin/advertising'

import RevenueForm from './components/RevenueForm'

export default function AdminAdvertisingRevenueCreatePage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    const loadCampaigns = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getAdminCampaigns(
          accessToken,
        )

        setCampaigns(
          Array.isArray(response)
            ? response
            : response.results || [],
        )
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load campaigns.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadCampaigns()
  }, [accessToken])

  const handleSubmit = async (data: RevenueFormData) => {
    if (!accessToken) return

    setSaving(true)

    try {
      const revenue =
        await createAdminAdvertisingRevenue(
          accessToken,
          data,
        )

      navigate(
        `/admin/advertising/revenue/${revenue.id}`,
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() =>
            navigate('/admin/advertising/revenue')
          }
          className="mb-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Revenue
        </button>

        <h1 className="text-2xl font-semibold text-slate-900">
          Record Advertising Revenue
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a new advertising revenue record.
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
          <RevenueForm
            campaigns={campaigns}
            onSubmit={handleSubmit}
            submitLabel="Record Revenue"
            loading={saving}
          />
        </div>
      </Card>
    </div>
  )
}