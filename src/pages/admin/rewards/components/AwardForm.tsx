import { useState } from 'react'

import type {
  AdminAward,
  AwardFormData,
} from '../../../../types/admin/rewards'

interface Props {
  initialData?: AdminAward
  submitting?: boolean
  onSubmit: (data: AwardFormData) => void
}

export default function AwardForm({
  initialData,
  submitting = false,
  onSubmit,
}: Props) {
  const [name, setName] = useState(
    initialData?.name ?? '',
  )

  const [description, setDescription] = useState(
    initialData?.description ?? '',
  )

  const [criteria, setCriteria] = useState(
    initialData?.criteria ?? '',
  )

  const [pointsRequired, setPointsRequired] =
    useState(
      String(initialData?.points_required ?? 0),
    )

  const [numberOfWinners, setNumberOfWinners] =
    useState(
      String(initialData?.number_of_winners ?? 1),
    )

  const [awardPeriod, setAwardPeriod] = useState(
    initialData?.award_period ?? 'CUSTOM',
  )

  const [startDate, setStartDate] = useState(
    initialData?.start_date ?? '',
  )

  const [endDate, setEndDate] = useState(
    initialData?.end_date ?? '',
  )

  const [qualificationRules, setQualificationRules] =
    useState(
      initialData?.qualification_rules
        ? JSON.stringify(
            initialData.qualification_rules,
            null,
            2,
          )
        : '{}',
    )

  const [status, setStatus] = useState(
    initialData?.status ?? 'DRAFT',
  )

  const [isActive, setIsActive] = useState(
    initialData?.is_active ?? true,
  )

  function submit(event: React.FormEvent) {
    event.preventDefault()

    onSubmit({
      name,
      description,
      criteria,
      points_required: Number(pointsRequired),
      number_of_winners: Number(numberOfWinners),
      award_period: awardPeriod,
      start_date: startDate,
      end_date: endDate,
      qualification_rules: qualificationRules,
      status,
      is_active: isActive,
    })
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-6"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Award Name
          </label>

          <input
            required
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Criteria
          </label>

          <textarea
            value={criteria}
            onChange={(event) =>
              setCriteria(event.target.value)
            }
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Points Required
          </label>

          <input
            type="number"
            min="0"
            required
            value={pointsRequired}
            onChange={(event) =>
              setPointsRequired(event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Number of Winners
          </label>

          <input
            type="number"
            min="1"
            required
            value={numberOfWinners}
            onChange={(event) =>
              setNumberOfWinners(event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Award Period
          </label>

          <select
            value={awardPeriod}
            onChange={(event) =>
              setAwardPeriod(event.target.value as any)
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          >
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="ANNUAL">Annual</option>
            <option value="CUSTOM">Custom</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as any)
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Start Date
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(event) =>
              setStartDate(event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            End Date
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(event) =>
              setEndDate(event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Qualification Rules JSON
          </label>

          <textarea
            value={qualificationRules}
            onChange={(event) =>
              setQualificationRules(event.target.value)
            }
            rows={6}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-emerald-500"
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) =>
              setIsActive(event.target.checked)
            }
            className="h-4 w-4 rounded border-slate-300 text-emerald-600"
          />

          <span className="text-sm font-medium text-slate-700">
            Award is active
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting
          ? 'Saving...'
          : initialData
            ? 'Update Award'
            : 'Create Award'}
      </button>
    </form>
  )
}