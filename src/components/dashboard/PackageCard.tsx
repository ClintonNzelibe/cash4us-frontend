import { CalendarDays, Package } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import type { ActivePackage } from '../../types/dashboard'

interface PackageCardProps {
  packageData: ActivePackage | null
}

export default function PackageCard({
  packageData,
}: PackageCardProps) {
  if (!packageData) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <Package size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              No Active Package
            </h3>

            <p className="text-sm text-slate-500">
              You don't currently have an active cycle.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            Active Package
          </p>

          <h3 className="mt-1 text-xl font-bold text-slate-900">
            {packageData.name}
          </h3>
        </div>

        <Badge variant="success">
          {packageData.status}
        </Badge>
      </div>

      <div className="mt-6">
        <p className="text-sm text-slate-500">
          Package Value
        </p>

        <p className="mt-1 text-2xl font-bold text-slate-900">
          {formatCurrency(packageData.price)}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
        <div className="flex gap-2">
          <CalendarDays
            size={17}
            className="mt-0.5 text-slate-400"
          />

          <div>
            <p className="text-xs text-slate-400">
              Started
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {formatDate(packageData.started_at)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <CalendarDays
            size={17}
            className="mt-0.5 text-slate-400"
          />

          <div>
            <p className="text-xs text-slate-400">
              Ends
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {formatDate(packageData.ends_at)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}