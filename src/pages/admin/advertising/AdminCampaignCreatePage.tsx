import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import {
  createAdminCampaign,
  getAdminAdvertisers,
} from '../../../services/adminAdvertisingService'

import type {
  AdminAdvertiser,
  CampaignFormData,
} from '../../../types/admin/advertising'

import CampaignForm from './components/CampaignForm'

export default function AdminCampaignCreatePage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [advertisers, setAdvertisers] = useState<AdminAdvertiser[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) {
      setLoading(false)
      return
    }

    const loadAdvertisers = async () => {
      try {
        setLoading(true)

        const response = await getAdminAdvertisers(accessToken)

        setAdvertisers(
          Array.isArray(response)
            ? response
            : response.results || [],
        )
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load advertisers.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadAdvertisers()
  }, [accessToken])

  const handleSubmit = async (data: CampaignFormData) => {
    if (!accessToken) return

    setSaving(true)

    try {
      const campaign = await createAdminCampaign(
        accessToken,
        data,
      )

      navigate(`/admin/advertising/campaigns/${campaign.id}`)
    } catch (err) {
      throw err
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
          onClick={() => navigate('/admin/advertising/campaigns')}
          className="mb-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Campaigns
        </button>

        <h1 className="text-2xl font-semibold text-slate-900">
          Create Campaign
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a new advertising campaign.
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
          {advertisers.length === 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              No advertisers are available. Create an advertiser first.
            </div>
          ) : (
            <CampaignForm
              advertisers={advertisers}
              onSubmit={handleSubmit}
              submitLabel="Create Campaign"
              loading={saving}
            />
          )}
        </div>
      </Card>
    </div>
  )
}