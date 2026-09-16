import {
  CheckCircle2,
  Flame,
  ListChecks,
  XCircle,
} from 'lucide-react'
import Card from '../ui/Card'

interface TaskCardProps {
  assigned: number
  completed: number
  missed: number
  streak: number
  completionRate: number
}

export default function TaskCard({
  assigned,
  completed,
  missed,
  streak,
  completionRate,
}: TaskCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Daily Tasks
          </p>

          <h3 className="mt-1 text-xl font-bold text-slate-900">
            {completionRate}%
          </h3>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <ListChecks size={20} />
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#22C55E] transition-all"
          style={{
            width: `${Math.min(Math.max(completionRate, 0), 100)}%`,
          }}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div>
          <CheckCircle2
            size={16}
            className="text-emerald-500"
          />

          <p className="mt-1 text-lg font-semibold">
            {completed}
          </p>

          <p className="text-xs text-slate-500">
            Completed
          </p>
        </div>

        <div>
          <XCircle
            size={16}
            className="text-red-500"
          />

          <p className="mt-1 text-lg font-semibold">
            {missed}
          </p>

          <p className="text-xs text-slate-500">
            Missed
          </p>
        </div>

        <div>
          <Flame
            size={16}
            className="text-orange-500"
          />

          <p className="mt-1 text-lg font-semibold">
            {streak}
          </p>

          <p className="text-xs text-slate-500">
            Streak
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        {assigned} tasks assigned during your current cycle.
      </p>
    </Card>
  )
}