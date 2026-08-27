import type { Order } from '../../data/types'
import { formatNaira } from '../../data/mockData'
import { StatusBadge } from '../ui/StatusBadge'

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <li className="px-4 py-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{order.customerName}</p>
          <p className="truncate text-sm text-neutral-600">{order.productDescription}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-2.5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-neutral-500">Order ID</p>
          <p className="font-data text-data-md font-bold tabular-nums text-ink">
            {order.id}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-neutral-500">COD</p>
          <p className="font-data text-lg font-bold tabular-nums text-ink">
            {formatNaira(order.codAmount)}
          </p>
        </div>
      </div>

      <p className="mt-1.5 truncate text-sm text-neutral-500">{order.customerAddress}</p>
    </li>
  )
}
