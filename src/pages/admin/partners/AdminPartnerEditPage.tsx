import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { useAuth } from '../../../context/AuthContext'
import {
  getAdminPartner,
  updateAdminPartner,
} from '../../../services/adminPartnerService'
import type {
  AdminPartner,
  PartnerFormData,
} from '../../../types/admin/partners'

import PartnerForm from './components/PartnerForm'

export default function AdminPartnerEditPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const [partner, setPartner] = useState<AdminPartner | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadPartner = useCallback(async () => {
    if (!accessToken || !id) {
      return
    }

    try {
      setLoading(true)
      setError('')

      const data = await getAdminPartner(accessToken, id)
      setPartner(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load partner.',
      )
    } finally {
      setLoading(false)
    }
  }, [accessToken, id])

  useEffect(() => {
    void loadPartner()
  }, [loadPartner])

  async function handleSubmit(data: PartnerFormData) {
    if (!accessToken || !id) {
      setError('Authentication or partner ID is unavailable.')
      return
    }

    try {
      setSaving(true)
      setError('')

      await updateAdminPartner(
        accessToken,
        id,
        data,
      )

      navigate(`/admin/partners/${id}`)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update partner.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Loading partner...
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/partners"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600"
        >
          <ArrowLeft size={16} />
          Back to Partners
        </Link>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || 'Partner not found.'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/admin/partners/${partner.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Partner
        </Link>

        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Edit Partner
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update {partner.name}.
        </p>
      </div>

      <PartnerForm
        initialData={partner}
        submitLabel="Save Changes"
        loading={saving}
        error={error}
        onSubmit={handleSubmit}
      />
    </div>
  )
}