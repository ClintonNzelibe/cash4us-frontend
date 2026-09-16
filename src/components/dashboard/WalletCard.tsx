import { ArrowUpRight, Wallet } from 'lucide-react'
import Card from '../ui/Card'
import { formatCurrency } from '../../utils/formatCurrency'

interface WalletCardProps {
  balance: string
  availableBalance: string
  pendingBalance: string
}

export default function WalletCard({
  balance,
  availableBalance,
  pendingBalance,
}: WalletCardProps) {
  return (
    <Card className="overflow-hidden border-0 bg-[#0F766E] text-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Wallet size={22} />
            </div>

            <div>
              <p className="text-sm text-white/70">
                Total Wallet Balance
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                {formatCurrency(balance)}
              </h2>
            </div>
          </div>

          <ArrowUpRight size={22} className="text-white/70" />
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
          <div>
            <p className="text-xs text-white/60">
              Available
            </p>

            <p className="mt-1 font-semibold">
              {formatCurrency(availableBalance)}
            </p>
          </div>

          <div>
            <p className="text-xs text-white/60">
              Pending
            </p>

            <p className="mt-1 font-semibold">
              {formatCurrency(pendingBalance)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}