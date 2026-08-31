import type { Order } from '../../data/types'
import { formatNaira } from '../../data/mockData'
import { StatusBadge } from '../ui/StatusBadge'
import { ChevronRight, MapPin } from 'lucide-react'

interface OrderListRowProps {
  order: Order
  onClick?: () => void
  /** Extra meta line (seller, rider, time) */
  meta?: string
  pickupLabel?: string
  dropoffLabel?: string
}

function dropoffAreaFrom(address: string) {
  const match = address.match(/([^,]+),\s*Lagos$/i)
  return match ? match[1].trim() : 'Lagos'
}

export function OrderListRow({
  order,
  onClick,
  meta,
  pickupLabel,
  dropoffLabel,
}: OrderListRowProps) {
  const dropoff = dropoffLabel ?? dropoffAreaFrom(order.customerAddress)
  const route = pickupLabel ? `${pickupLabel} → ${dropoff}` : `${order.customerName} → ${dropoff}`

  const inner = (
    <>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-data text-data-md font-bold tabular-nums text-ink">
            {order.id}
          </span>
          <StatusBadge status={order.status} />
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-neutral-600">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
          <span className="truncate">{route}</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          {order.codAmount > 0 ? (
            <span className="inline-flex items-center rounded-full bg-status-warning-bg px-2 py-0.5 text-xs font-semibold text-status-warning">
              COD {formatNaira(order.codAmount)}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
              Prepaid
            </span>
          )}
          {meta && <span className="truncate text-sm text-neutral-500">{meta}</span>}
        </div>
      </div>
      {onClick && <ChevronRight className="h-5 w-5 shrink-0 text-neutral-300" />}
    </>
  )

  const className =
    'flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-neutral-50 active:bg-neutral-50'

  if (onClick) {
    return (
      <li>
        <button type="button" onClick={onClick} className={className}>
          {inner}
        </button>
      </li>
    )
  }

  return <li className={className}>{inner}</li>
}

export { dropoffAreaFrom }
