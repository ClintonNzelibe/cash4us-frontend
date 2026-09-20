import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Card from '../../../components/ui/Card'
import { useAuth } from '../../../context/AuthContext'
import {
  createAdminResource,
} from '../../../services/adminResourceService'

import type {
  ResourceFormData,
} from '../../../types/admin/resources'

import ResourceForm from './components/ResourceForm'

export default function AdminResourceCreatePage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (
    data: ResourceFormData,
  ) => {
    if (!accessToken) {
      throw new Error('Authentication required.')
    }

    try {
      setLoading(true)
      setError('')

      const resource =
        await createAdminResource(
          accessToken,
          data,
        )

      navigate(
        `/admin/resources/${resource.id}`,
      )
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to create resource.'

      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin/resources"
          className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          ← Back to Resources
        </Link>

        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          Add Resource
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Add a new learning resource to the member library.
        </p>
      </div>

      {error && (
        <Card>
          <div className="p-4">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        </Card>
      )}

      <ResourceForm
        loading={loading}
        submitLabel="Create Resource"
        onSubmit={handleSubmit}
      />
    </div>
  )
}