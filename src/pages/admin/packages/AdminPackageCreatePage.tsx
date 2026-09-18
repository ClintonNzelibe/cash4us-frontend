import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'

import { useAuth } from '../../../context/AuthContext'

import {
  createAdminPackage,
} from '../../../services/adminPackageService'

import type { AdminPackagePayload } from '../../../types/admin/packages'

import PackageFormModal from './components/PackageFormModal'

export default function AdminPackageCreatePage() {
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [error, setError] = useState('')

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        onClick={() => navigate('/admin/packages')}
      >
        <ArrowLeft size={17} className="mr-2" />
        Back to Packages
      </Button>

      <Card className="p-6">
        <h1 className="text-xl font-bold text-slate-900">
          Create Package
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Configure a new Cash4Us membership package.
        </p>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}
      </Card>

      <PackageFormModal
        isOpen
        mode="create"
        isSubmitting={isSubmitting}
        error={error}
        onClose={() => navigate('/admin/packages')}
        onSubmit={async (
          data: AdminPackagePayload,
        ) => {
          if (!accessToken) return

          setIsSubmitting(true)
          setError('')

          try {
            const created =
              await createAdminPackage(
                data,
                accessToken,
              )

            navigate(
              `/admin/packages/${created.id}`,
              { replace: true },
            )
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : 'Failed to create package.',
            )
          } finally {
            setIsSubmitting(false)
          }
        }}
      />
    </div>
  )
}