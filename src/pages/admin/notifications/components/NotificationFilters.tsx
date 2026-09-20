import type {
  NotificationFilters as NotificationFilterValues,
  NotificationType,
} from '../../../../types/admin/notifications'

interface NotificationFiltersProps {
  filters: NotificationFilterValues
  onChange: (
    filters: NotificationFilterValues,
  ) => void
}

const notificationTypes: NotificationType[] = [
  'TASK',
  'POINTS',
  'AWARD',
  'WITHDRAWAL',
  'MEMBERSHIP',
  'SYSTEM',
]

export default function NotificationFilters({
  filters,
  onChange,
}: NotificationFiltersProps) {
  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-3">
      <input
        type="text"
        value={filters.search ?? ''}
        onChange={(event) =>
          onChange({
            ...filters,
            search: event.target.value,
          })
        }
        placeholder="Search notifications..."
        className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />

      <select
        value={filters.notification_type ?? ''}
        onChange={(event) =>
          onChange({
            ...filters,
            notification_type:
              event.target.value as NotificationType | '',
          })
        }
        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="">All types</option>

        {notificationTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select
        value={
          filters.is_read === '' ||
          filters.is_read === undefined
            ? ''
            : String(filters.is_read)
        }
        onChange={(event) => {
          const value = event.target.value

          onChange({
            ...filters,
            is_read:
              value === ''
                ? ''
                : value === 'true',
          })
        }}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      >
        <option value="">All read status</option>
        <option value="false">Unread</option>
        <option value="true">Read</option>
      </select>
    </div>
  )
}