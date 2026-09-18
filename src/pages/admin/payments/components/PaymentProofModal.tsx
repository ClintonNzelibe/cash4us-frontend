import Modal from '../../../../components/ui/Modal'
import type { AdminPayment } from '../../../../types/admin/payments'

interface Props {
  payment: AdminPayment | null
  onClose: () => void
}

const API_ORIGIN = 'http://127.0.0.1:8000'

function getProofUrl(proof: string) {
  if (proof.startsWith('http://') || proof.startsWith('https://')) {
    return proof
  }

  if (proof.startsWith('/')) {
    return `${API_ORIGIN}${proof}`
  }

  return `${API_ORIGIN}/media/${proof}`
}

export default function PaymentProofModal({
  payment,
  onClose,
}: Props) {
  if (!payment) return null

  return (
    <Modal
      isOpen={Boolean(payment)}
      onClose={onClose}
      title="Proof of Payment"
    >
      <div className="space-y-4">
        {payment.proof_of_payment ? (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <img
              src={getProofUrl(payment.proof_of_payment)}
              alt="Payment proof"
              className="max-h-[70vh] w-full object-contain"
            />
          </div>
        ) : (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center">
            <p className="text-sm text-slate-500">
              No proof of payment was uploaded.
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}