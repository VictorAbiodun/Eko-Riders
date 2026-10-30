import { formatNaira } from '../../data/mockData'
import type { Rider } from '../../data/types'
import { useAppData } from '../../context/AppContext'
import { TrendingUp, Wallet, Award } from 'lucide-react'

interface RiderEarningsProps {
  rider: Rider
}

export function RiderEarnings({ rider }: RiderEarningsProps) {
  const { orders } = useAppData()

  const riderOrders = orders.filter(
    (o) => o.riderName === rider.name && o.status === 'DELIVERED',
  )
  const completedCount = riderOrders.length

  // Mock weekly earnings logic
  const baseRate = 800
  const grossEarnings = completedCount * baseRate
  const bonuses = completedCount > 5 ? 3000 : 0
  const total = grossEarnings + bonuses

  return (
    <div className="p-5">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">
          Earnings
        </h1>
        <p className="mt-1 text-sm text-neutral-500">This week</p>
      </div>

      <div className="rounded-2xl bg-brand p-6 text-white shadow-sm">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-brand-100" />
          <p className="text-sm font-medium text-brand-100">Total Payout</p>
        </div>
        <p className="mt-2 font-data text-4xl font-bold tracking-tight">
          {formatNaira(total)}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-neutral-400" />
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Deliveries
            </p>
          </div>
          <p className="mt-2 font-data text-2xl font-bold text-ink">
            {completedCount}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-brand-700" />
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              Bonuses
            </p>
          </div>
          <p className="mt-2 font-data text-xl font-bold text-ink">
            {formatNaira(bonuses)}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="text-sm font-bold text-ink">Breakdown</h3>

        <div className="mt-4 flex items-center justify-between border-b border-neutral-100 pb-3">
          <p className="text-sm text-neutral-600">Base earnings</p>
          <p className="font-data font-medium text-ink">
            {formatNaira(grossEarnings)}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between pb-3">
          <p className="text-sm text-neutral-600">Performance bonus</p>
          <p className="font-data font-medium text-brand-700">
            {bonuses > 0 ? '+' : ''}
            {formatNaira(bonuses)}
          </p>
        </div>
      </div>
    </div>
  )
}
