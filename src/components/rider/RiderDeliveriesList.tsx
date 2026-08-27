import { ChevronRight, MapPin } from 'lucide-react'
import { useAppData } from '../../context/AppContext'
import { formatNaira } from '../../data/mockData'
import type { Rider, Order } from '../../data/types'
import { StatusBadge } from '../ui/StatusBadge'
import { EmptyState } from '../ui/EmptyState'
import { Package } from 'lucide-react'

interface RiderDeliveriesListProps {
  rider: Rider
  onSelectOrder: (orderId: string) => void
}

export function RiderDeliveriesList({
  rider,
  onSelectOrder,
}: RiderDeliveriesListProps) {
  const { orders } = useAppData()

  const riderOrders = orders.filter((o) => o.riderName === rider.name)

  const activeOrders = riderOrders.filter((o) =>
    ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.status),
  )
  const completedOrders = riderOrders.filter((o) => o.status === 'DELIVERED')

  if (riderOrders.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          icon={Package}
          title="No deliveries assigned"
          description="You don't have any orders assigned to you yet."
        />
      </div>
    )
  }

  const renderOrderList = (list: Order[]) => (
    <ul className="divide-y divide-neutral-100">
      {list.map((order) => {
        // Mock route logic: Seller Area -> Customer Area
        // In the mock data, customerAddress usually ends with the area, e.g., "Yaba, Lagos".
        const dropoffMatch = order.customerAddress.match(/([^,]+),\s*Lagos$/i)
        const dropoffArea = dropoffMatch ? dropoffMatch[1].trim() : 'Lagos'
        
        // Find seller area from context (we can just pull it from the sellers list)
        const pickupArea = 'Lekki' // Simplified for demo, can look up seller by order.sellerName if needed

        return (
          <li key={order.id}>
            <button
              type="button"
              onClick={() => onSelectOrder(order.id)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors active:bg-neutral-50"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-data text-sm font-bold text-ink">
                    {order.id}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                
                <div className="mt-2 flex items-center gap-1.5 text-sm text-neutral-600">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                  <span className="truncate">
                    {pickupArea} <span className="text-neutral-400">→</span> {dropoffArea}
                  </span>
                </div>

                {order.codAmount > 0 && (
                  <div className="mt-2 inline-flex items-center rounded bg-status-warning-bg px-1.5 py-0.5 text-xs font-semibold text-status-warning">
                    COD {formatNaira(order.codAmount)}
                  </div>
                )}
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-neutral-300" />
            </button>
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className="bg-white min-h-dvh">
      {activeOrders.length > 0 && (
        <div>
          <div className="bg-neutral-50 px-5 py-2.5 border-y border-neutral-200">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Active deliveries ({activeOrders.length})
            </h2>
          </div>
          {renderOrderList(activeOrders)}
        </div>
      )}

      {completedOrders.length > 0 && (
        <div>
          <div className="bg-neutral-50 px-5 py-2.5 border-y border-neutral-200">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Completed ({completedOrders.length})
            </h2>
          </div>
          {renderOrderList(completedOrders)}
        </div>
      )}
    </div>
  )
}
