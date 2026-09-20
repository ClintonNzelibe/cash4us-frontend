import type { SupportTicketStatus } from '../../../../types/admin/support'

interface Props {
  status: SupportTicketStatus
}

export default function SupportTicketStatusBadge({
  status,
}: Props) {
  const styles: Record<SupportTicketStatus, string> = {
    OPEN: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
    REPLIED:
      'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
    CLOSED:
      'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200',
  }

  const labels: Record<SupportTicketStatus, string> = {
    OPEN: 'Open',
    REPLIED: 'Replied',
    CLOSED: 'Closed',
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}