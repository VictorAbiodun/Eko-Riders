import { ChevronRight, TrendingUp } from 'lucide-react'
import { useAppData } from '../../context/AppContext'
import { formatNaira } from '../../data/mockData'
import type { Rider } from '../../data/types'

interface RiderHomeProps {
  rider: Rider
  onNavigateToDeliveries: () => void
  onNavigateToEarnings: () => void
}

export function RiderHome({
  rider,
  onNavigateToDeliveries,
  onNavigateToEarnings,
}: RiderHomeProps) {
  const { orders } = useAppData()

  const riderOrders = orders.filter((o) => o.riderName === rider.name)
  const completed = riderOrders.filter((o) => o.status === 'DELIVERED').length
  const active = riderOrders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length
  const pending = riderOrders.filter((o) =>
    ['ASSIGNED', 'PICKED_UP'].includes(o.status),
  ).length

  // Mock today's earnings: Base + (Completed * Rate) + Bonuses
  const todayEarnings = 2500 + completed * 800

  return (
    <div className="flex flex-col gap-6 p-5">
      {/* ── Greeting ── */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">
          Good morning, {rider.name.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          You're online in {rider.currentZone}
        </p>
      </div>

      {/* ── Today's stats ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-3 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Completed
          </p>
          <p className="mt-1 font-data text-2xl font-bold text-ink">
            {completed}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-3 text-center shadow-sm ring-1 ring-brand/20">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-700">
            Active
          </p>
          <p className="mt-1 font-data text-2xl font-bold text-brand-700">
            {active}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-3 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Pending
          </p>
          <p className="mt-1 font-data text-2xl font-bold text-ink">
            {pending}
          </p>
        </div>
      </div>

      {/* ── Earnings summary card ── */}
      <button
        type="button"
        onClick={onNavigateToEarnings}
        className="flex w-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white text-left transition-colors active:bg-neutral-50"
      >
        <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-status-success-bg">
              <TrendingUp className="h-3.5 w-3.5 text-status-success" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
              Today's Earnings
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-neutral-400" />
        </div>
        <div className="px-4 py-5">
          <p className="font-data text-3xl font-bold tabular-nums tracking-tight text-ink">
            {formatNaira(todayEarnings)}
          </p>
        </div>
      </button>

      {/* ── My Deliveries CTA ── */}
      <button
        type="button"
        onClick={onNavigateToDeliveries}
        className="mt-2 flex min-h-touch w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition-opacity active:opacity-90"
      >
        View my deliveries
        <div className="flex h-5 items-center justify-center rounded-full bg-white/20 px-2 text-xs">
          {active + pending}
        </div>
      </button>
    </div>
  )
}
