import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import {
  getAdminAdvertiser,
  updateAdminAdvertiser,
} from '../../../services/adminAdvertisingService'

import type {
  AdminAdvertiser,
  AdvertiserFormData,
} from '../../../types/admin/advertising'

import AdvertiserForm from './components/AdvertiserForm'

export default function AdminAdvertiserEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [advertiser, setAdvertiser] = useState<AdminAdvertiser | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id || !accessToken) {
      setLoading(false)
      return
    }

    const loadAdvertiser = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getAdminAdvertiser(accessToken, id)
        setAdvertiser(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load advertiser.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadAdvertiser()
  }, [id, accessToken])

  const handleSubmit = async (data: AdvertiserFormData) => {
    if (!id || !accessToken) return

    try {
      setSaving(true)
      setError('')

      await updateAdminAdvertiser(accessToken, id, data)

      navigate(`/admin/advertising/advertisers/${id}`)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update advertiser.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <PageLoader />
  }

  if (!advertiser) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/admin/advertising/advertisers')}
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Advertisers
        </button>

        <Card>
          <div className="p-6 text-sm text-red-600">
            {error || 'Advertiser not found.'}
          </div>
        </Card>
      </div>
    )
  }

  const initialData: AdvertiserFormData = {
    name: advertiser.name,
    email: advertiser.email,
    phone: advertiser.phone,
    company_name: advertiser.company_name,
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() =>
            navigate(`/admin/advertising/advertisers/${advertiser.id}`)
          }
          className="mb-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Advertiser
        </button>

        <h1 className="text-2xl font-semibold text-slate-900">
          Edit Advertiser
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update advertiser information.
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
          <AdvertiserForm
            initialData={initialData}
            onSubmit={handleSubmit}
            submitLabel={saving ? 'Saving...' : 'Save Changes'}
            />
        </div>
      </Card>
    </div>
  )
}