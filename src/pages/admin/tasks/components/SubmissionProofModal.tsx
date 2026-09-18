import Modal from '../../../../components/ui/Modal'

interface SubmissionProofModalProps {
  open: boolean
  proofType?: string
  proofImage?: string | null
  proofUrl?: string
  proofDetails?: string
  onClose: () => void
}

export default function SubmissionProofModal({
  open,
  proofType,
  proofImage,
  proofUrl,
  proofDetails,
  onClose,
}: SubmissionProofModalProps) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Submission Proof"
    >
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Proof type
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {proofType || '—'}
          </p>
        </div>

        {proofImage && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Screenshot
            </p>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <img
                src={proofImage}
                alt="Task submission proof"
                className="max-h-[500px] w-full object-contain"
              />
            </div>
          </div>
        )}

        {proofUrl && (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Post URL
            </p>

            <a
              href={proofUrl}
              target="_blank"
              rel="noreferrer"
              className="break-all text-sm font-medium text-emerald-700 hover:underline"
            >
              {proofUrl}
            </a>
          </div>
        )}

        {proofDetails && (
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Details
            </p>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
              {proofDetails}
            </div>
          </div>
        )}

        {!proofImage &&
          !proofUrl &&
          !proofDetails && (
            <p className="text-sm text-slate-500">
              No proof details were provided.
            </p>
          )}
      </div>
    </Modal>
  )
}