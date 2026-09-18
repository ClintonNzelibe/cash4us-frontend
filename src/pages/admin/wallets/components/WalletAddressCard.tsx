import type { AdminWalletAddress } from '../../../../types/admin/wallets'

import WalletStatusBadge from './WalletStatusBadge'

interface WalletAddressCardProps {
  address: AdminWalletAddress
}

export default function WalletAddressCard({
  address,
}: WalletAddressCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {address.network}
          </p>

          <p className="mt-2 break-all font-mono text-sm text-slate-600">
            {address.address}
          </p>
        </div>

        <WalletStatusBadge
          isDefault={address.is_default}
        />
      </div>
    </div>
  )
}