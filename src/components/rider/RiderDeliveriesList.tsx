import { Search } from 'lucide-react'
import { useAppData } from '../../context/AppContext'
import type { Rider, Order } from '../../data/types'
import { StatusBadge } from '../ui/StatusBadge'
import { EmptyState } from '../ui/EmptyState'
import { TrackingStepper } from '../orders/TrackingStepper'
import { dropoffAreaFrom } from '../orders/OrderListRow'

interface RiderDeliveriesListProps {
  rider: Rider
  onSelectOrder: (orderId: string) => void
}

function formatDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function DeliveryCard({
  order,
  isHero,
  onClick,
  index,
}: {
  order: Order
  isHero: boolean
  onClick: () => void
  index: number
}) {
  const dropoffArea = dropoffAreaFrom(order.customerAddress)
  const pickupArea = 'Lekki'
  const estimatedDate = new Date(new Date(order.createdAt).getTime() + 2 * 60 * 60 * 1000)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`card-press w-full rounded-xl p-5 text-left transition-all ${
        isHero ? 'bg-brand text-white shadow-sm' : 'border border-neutral-200 bg-white shadow-sm'
      }`}
      style={{
        animation: 'card-enter 0.4s ease-out both',
        animationDelay: `${index * 60}ms`,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`font-data text-data-md font-bold tabular-nums ${
            isHero ? 'text-white' : 'text-ink'
          }`}
        >
          {order.id}
        </span>
        <StatusBadge status={order.status} inverse={isHero} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${isHero ? 'text-white/70' : 'text-neutral-500'}`}>
            From
          </p>
          <p className={`mt-0.5 text-sm font-bold ${isHero ? 'text-white' : 'text-ink'}`}>
            {pickupArea}
          </p>
        </div>
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${isHero ? 'text-white/70' : 'text-neutral-500'}`}>
            To
          </p>
          <p className={`mt-0.5 text-sm font-bold ${isHero ? 'text-white' : 'text-ink'}`}>
            {dropoffArea}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${isHero ? 'text-white/70' : 'text-neutral-500'}`}>
            Placed
          </p>
          <p className={`mt-0.5 text-sm font-medium ${isHero ? 'text-white/80' : 'text-neutral-600'}`}>
            {formatDateShort(order.createdAt)}
          </p>
        </div>
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider ${isHero ? 'text-white/70' : 'text-neutral-500'}`}>
            ETA
          </p>
          <p className={`mt-0.5 text-sm font-medium ${isHero ? 'text-white/80' : 'text-neutral-600'}`}>
            {formatDateShort(estimatedDate.toISOString())}
          </p>
        </div>
      </div>

      <div className={`mt-3 border-t pt-3 ${isHero ? 'border-white/20' : 'border-neutral-100'}`}>
        <TrackingStepper status={order.status} variant={isHero ? 'onBrand' : 'compact'} />
      </div>
    </button>
  )
}

export function RiderDeliveriesList({ rider, onSelectOrder }: RiderDeliveriesListProps) {
  const { orders } = useAppData()
  const riderOrders = orders.filter((o) => o.riderName === rider.name)

  const activeOrders = riderOrders.filter((o) =>
    ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.status),
  )
  const completedOrders = riderOrders.filter((o) => o.status === 'DELIVERED')

  if (riderOrders.length === 0) {
    return (
      <EmptyState
        title="No deliveries assigned"
        description="You don't have any orders assigned to you yet."
      />
    )
  }

  const heroOrderId =
    riderOrders.find((o) => o.status === 'OUT_FOR_DELIVERY')?.id ??
    riderOrders.find((o) => o.status === 'PICKED_UP')?.id ??
    riderOrders.find((o) => o.status === 'ASSIGNED')?.id ??
    null

  const allOrders = [...activeOrders, ...completedOrders]

  return (
    <div className="min-h-full bg-neutral-50">
      <div className="px-4 pt-5 pb-4">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">
          Recent Shipping
        </h1>
        <div className="mt-4 flex min-h-touch items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4">
          <Search className="h-5 w-5 text-neutral-400" strokeWidth={2} />
          <span className="text-sm text-neutral-400">Search Shipping</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 pb-8">
        {allOrders.map((order, index) => (
          <DeliveryCard
            key={order.id}
            order={order}
            isHero={order.id === heroOrderId}
            onClick={() => onSelectOrder(order.id)}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}
