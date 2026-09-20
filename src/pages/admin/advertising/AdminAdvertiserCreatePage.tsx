import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import Card from '../../../components/ui/Card'
import { useAuth } from '../../../context/AuthContext'

import { createAdminAdvertiser } from '../../../services/adminAdvertisingService'

import type { AdvertiserFormData } from '../../../types/admin/advertising'

import AdvertiserForm from './components/AdvertiserForm'

export default function AdminAdvertiserCreatePage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [submitting, setSubmitting] =
    useState(false)

  const [error, setError] = useState('')

  const handleSubmit = async (
    data: AdvertiserFormData,
  ) => {
    if (!accessToken) return

    try {
      setSubmitting(true)
      setError('')

      const advertiser =
        await createAdminAdvertiser(
          accessToken,
          data,
        )

      navigate(
        `/admin/advertising/advertisers/${advertiser.id}`,
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create advertiser.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link
        to="/admin/advertising/advertisers"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F766E] hover:text-[#115E59]"
      >
        <ArrowLeft size={17} />
        Back to Advertisers
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Add Advertiser
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a new advertising partner.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <AdvertiserForm
          submitting={submitting}
          submitLabel="Create Advertiser"
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  )
}