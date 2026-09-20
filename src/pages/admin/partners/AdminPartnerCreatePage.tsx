import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { useAuth } from '../../../context/AuthContext'
import { createAdminPartner } from '../../../services/adminPartnerService'
import type { PartnerFormData } from '../../../types/admin/partners'

import PartnerForm from './components/PartnerForm'

export default function AdminPartnerCreatePage() {
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(data: PartnerFormData) {
    if (!accessToken) {
      setError('Authentication token is unavailable.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const partner = await createAdminPartner(
        accessToken,
        data,
      )

      navigate(`/admin/partners/${partner.id}`)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create partner.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin/partners"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Partners
        </Link>

        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Add Partner
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a new partner company.
        </p>
      </div>

      <PartnerForm
        submitLabel="Create Partner"
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  )
}