import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import PageLoader from '../../../components/ui/PageLoader'

import { useAuth } from '../../../context/AuthContext'

import {
  getAdminCampaign,
  getAdminAdvertisers,
  updateAdminCampaign,
} from '../../../services/adminAdvertisingService'

import type {
  AdminAdvertiser,
  AdminCampaign,
  CampaignFormData,
} from '../../../types/admin/advertising'

import CampaignForm from './components/CampaignForm'

export default function AdminCampaignEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [campaign, setCampaign] = useState<AdminCampaign | null>(null)
  const [advertisers, setAdvertisers] = useState<AdminAdvertiser[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id || !accessToken) {
      setLoading(false)
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const [campaignResponse, advertiserResponse] =
          await Promise.all([
            getAdminCampaign(accessToken, id),
            getAdminAdvertisers(accessToken),
          ])

        setCampaign(campaignResponse)

        setAdvertisers(
          Array.isArray(advertiserResponse)
            ? advertiserResponse
            : advertiserResponse.results || [],
        )
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load campaign.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, accessToken])

  const handleSubmit = async (data: CampaignFormData) => {
    if (!id || !accessToken) return

    setSaving(true)

    try {
      await updateAdminCampaign(accessToken, id, data)

      navigate(`/admin/advertising/campaigns/${id}`)
    } catch (err) {
      throw err
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <PageLoader />
  }

  if (!campaign) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate('/admin/advertising/campaigns')}
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Campaigns
        </button>

        <Card>
          <div className="p-6 text-sm text-red-600">
            {error || 'Campaign not found.'}
          </div>
        </Card>
      </div>
    )
  }

  const initialData: CampaignFormData = {
    advertiser: campaign.advertiser,
    title: campaign.title,
    description: campaign.description,
    campaign_url: campaign.campaign_url,
    status: campaign.status,
    start_date: campaign.start_date || '',
    end_date: campaign.end_date || '',
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() =>
            navigate(`/admin/advertising/campaigns/${campaign.id}`)
          }
          className="mb-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Campaign
        </button>

        <h1 className="text-2xl font-semibold text-slate-900">
          Edit Campaign
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update campaign information.
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
          <CampaignForm
            advertisers={advertisers}
            initialData={initialData}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            loading={saving}
          />
        </div>
      </Card>
    </div>
  )
}