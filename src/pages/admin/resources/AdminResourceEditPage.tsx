import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PageLoader from '../../../components/ui/PageLoader'
import { useAuth } from '../../../context/AuthContext'
import { getAdminResource, updateAdminResource } from '../../../services/adminResourceService'
import type { AdminResource, ResourceFormData } from '../../../types/admin/resources'
import ResourceForm from './components/ResourceForm'

export default function AdminResourceEditPage() {
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuth()
  const navigate = useNavigate()
  const [resource, setResource] = useState<AdminResource | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken || !id) return
    let active = true
    setLoading(true)
    getAdminResource(accessToken, id)
      .then(value => { if (active) setResource(value) })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : 'Unable to load resource.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [accessToken, id])

  const initialData = useMemo<Partial<ResourceFormData> | undefined>(() => resource ? {
    title: resource.title,
    description: resource.description,
    resource_type: resource.resource_type,
    external_link: resource.external_link || '',
    resource_file: null,
  } : undefined, [resource])

  async function save(data: ResourceFormData) {
    if (!accessToken || !id) throw new Error('Authentication required.')
    setSaving(true)
    try {
      await updateAdminResource(accessToken, id, data)
      navigate(`/admin/resources/${id}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoader />
  return (
    <div className="space-y-6">
      <Link to="/admin/resources" className="text-sm font-medium text-emerald-700">Back to Resources</Link>
      <h1 className="text-2xl font-semibold text-slate-900">Edit Resource</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {resource && <ResourceForm initialData={initialData} existingFileUrl={resource.resource_file || undefined}
        loading={saving} submitLabel="Save Changes" onSubmit={save} />}
    </div>
  )
}
