import { useEffect, useState } from 'react'

import Button from '../../../../components/ui/Button'

import type {
  AdminDailyTask,
  AdminDailyTaskPayload,
  TaskPlatform,
} from '../../../../types/admin/tasks'

interface TaskFormProps {
  initialData?: AdminDailyTask | null
  loading?: boolean
  error?: string
  submitLabel?: string
  onSubmit: (payload: AdminDailyTaskPayload) => void
  onCancel: () => void
}

const platforms: TaskPlatform[] = [
  'FACEBOOK',
  'INSTAGRAM',
  'WHATSAPP',
  'TIKTOK',
  'TELEGRAM',
  'X',
  'YOUTUBE',
  'OTHER',
]

function formatDateTimeForInput(
  value?: string | null,
) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const offset = date.getTimezoneOffset()
  const localDate = new Date(
    date.getTime() - offset * 60 * 1000,
  )

  return localDate.toISOString().slice(0, 16)
}

export default function TaskForm({
  initialData,
  loading = false,
  error = '',
  submitLabel = 'Save Task',
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [reward, setReward] = useState('')
  const [points, setPoints] = useState('0')
  const [platform, setPlatform] =
    useState<TaskPlatform>('FACEBOOK')
  const [requiredPlatforms, setRequiredPlatforms] =
    useState<TaskPlatform[]>([])
  const [externalLink, setExternalLink] = useState('')
  const [advertisementText, setAdvertisementText] =
    useState('')
  const [promotionalLink, setPromotionalLink] =
    useState('')
  const [sharingInstructions, setSharingInstructions] =
    useState('')
  const [isActive, setIsActive] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [deadline, setDeadline] = useState('')

  const [flyer, setFlyer] = useState<File | null>(null)
  const [video, setVideo] = useState<File | null>(null)

  useEffect(() => {
    if (!initialData) {
      return
    }

    setTitle(initialData.title)
    setDescription(initialData.description)
    setReward(String(initialData.reward))
    setPoints(String(initialData.points))
    setPlatform(initialData.platform)

    setRequiredPlatforms(
      initialData.required_platforms ?? [],
    )

    setExternalLink(initialData.external_link ?? '')
    setAdvertisementText(
      initialData.advertisement_text ?? '',
    )
    setPromotionalLink(
      initialData.promotional_link ?? '',
    )
    setSharingInstructions(
      initialData.sharing_instructions ?? '',
    )

    setIsActive(initialData.is_active)
    setStartDate(initialData.start_date)
    setEndDate(initialData.end_date)
    setDeadline(
      formatDateTimeForInput(initialData.deadline),
    )
  }, [initialData])

  function togglePlatform(
    selectedPlatform: TaskPlatform,
  ) {
    setRequiredPlatforms((current) =>
      current.includes(selectedPlatform)
        ? current.filter(
            (item) => item !== selectedPlatform,
          )
        : [...current, selectedPlatform],
    )
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      reward: reward.trim(),
      points: Number(points) || 0,
      platform,
      required_platforms: requiredPlatforms,
      external_link: externalLink.trim(),
      advertisement_text:
        advertisementText.trim(),
      promotional_link: promotionalLink.trim(),
      sharing_instructions:
        sharingInstructions.trim(),
      is_active: isActive,
      start_date: startDate,
      end_date: endDate,
      deadline: deadline || null,
      flyer,
      video,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Task title
          </label>

          <input
            required
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Enter task title"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            required
            rows={4}
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Describe what members need to do..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Reward
          </label>

          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={reward}
            onChange={(event) =>
              setReward(event.target.value)
            }
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Points
          </label>

          <input
            required
            type="number"
            min="0"
            value={points}
            onChange={(event) =>
              setPoints(event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Primary platform
          </label>

          <select
            value={platform}
            onChange={(event) =>
              setPlatform(
                event.target.value as TaskPlatform,
              )
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {platforms.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            value={String(isActive)}
            onChange={(event) =>
              setIsActive(event.target.value === 'true')
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Required platforms
        </label>

        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {platforms.map((item) => {
            const selected =
              requiredPlatforms.includes(item)

            return (
              <label
                key={item}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition ${
                  selected
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() =>
                    togglePlatform(item)
                  }
                  className="accent-emerald-600"
                />

                {item}
              </label>
            )
          })}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Start date
          </label>

          <input
            required
            type="date"
            value={startDate}
            onChange={(event) =>
              setStartDate(event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            End date
          </label>

          <input
            required
            type="date"
            value={endDate}
            onChange={(event) =>
              setEndDate(event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Deadline
          </label>

          <input
            type="datetime-local"
            value={deadline}
            onChange={(event) =>
              setDeadline(event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />

          <p className="mt-1.5 text-xs text-slate-400">
            Optional exact deadline.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Flyer
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              setFlyer(
                event.target.files?.[0] ?? null,
              )
            }
            className="block w-full text-sm text-slate-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Video
          </label>

          <input
            type="file"
            accept="video/*"
            onChange={(event) =>
              setVideo(
                event.target.files?.[0] ?? null,
              )
            }
            className="block w-full text-sm text-slate-500"
          />
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            External link
          </label>

          <input
            type="url"
            value={externalLink}
            onChange={(event) =>
              setExternalLink(event.target.value)
            }
            placeholder="https://..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Advertisement text
          </label>

          <textarea
            rows={4}
            value={advertisementText}
            onChange={(event) =>
              setAdvertisementText(
                event.target.value,
              )
            }
            placeholder="Text members can copy and share..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Promotional link
          </label>

          <input
            type="url"
            value={promotionalLink}
            onChange={(event) =>
              setPromotionalLink(
                event.target.value,
              )
            }
            placeholder="https://..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Sharing instructions
          </label>

          <textarea
            rows={4}
            value={sharingInstructions}
            onChange={(event) =>
              setSharingInstructions(
                event.target.value,
              )
            }
            placeholder="Explain where and how the task should be shared..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}