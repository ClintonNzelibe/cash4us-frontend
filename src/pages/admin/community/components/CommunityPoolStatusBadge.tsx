import type { CommunityPoolStatus } from '../../../../types/admin/community'

interface Props {
  status: CommunityPoolStatus
}

const styles: Record<CommunityPoolStatus, string> = {
  OPEN: 'bg-emerald-50 text-emerald-700',
  CLOSED: 'bg-amber-50 text-amber-700',
  DISTRIBUTED: 'bg-blue-50 text-blue-700',
}

export default function CommunityPoolStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  )
}