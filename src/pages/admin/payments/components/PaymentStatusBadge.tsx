import Badge from '../../../../components/ui/Badge'
import type { PaymentStatus } from '../../../../types/admin/payments'

interface Props {
  status: PaymentStatus
}

export default function PaymentStatusBadge({ status }: Props) {
  if (status === 'APPROVED') {
    return <Badge variant="success">Approved</Badge>
  }

  if (status === 'REJECTED') {
    return <Badge variant="danger">Rejected</Badge>
  }

  return <Badge variant="warning">Pending</Badge>
}