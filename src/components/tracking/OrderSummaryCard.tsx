import { MapPin, Package, Banknote } from 'lucide-react'
import type { Order } from '../../data/types'
import { formatNaira } from '../../data/mockData'

interface OrderSummaryCardProps {
  order: Order
}

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Order summary card with From/To two-column layout matching the reference UI.
 * Shows addresses, dates, product, and COD info in a structured card.
 */
export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  // Parse pickup and dropoff areas
  const pickupArea = 'Lekki Phase 1, Lagos' // Simplified for demo
  const dropoffMatch = order.customerAddress.match(
    /([^,]+,\s*[^,]+),\s*Lagos$/i,
  )
  const dropoffArea = dropoffMatch
    ? `${dropoffMatch[1]}, Lagos`
    : order.customerAddress

  const estimatedDate = new Date(
    new Date(order.createdAt).getTime() + 2 * 60 * 60 * 1000,
  )

  return (
    <div className="mx-5 rounded-2xl border border-neutral-200 bg-white p-5">
      {/* From / To two-column */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            From
          </p>
          <p className="mt-1 text-sm font-bold leading-snug text-ink">
            {pickupArea}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            To
          </p>
          <p className="mt-1 text-sm font-bold leading-snug text-ink">
            {dropoffArea}
          </p>
        </div>
      </div>

      {/* Dates row */}
      <div className="mt-4 grid grid-cols-2 gap-5 border-t border-neutral-100 pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            Placed by
          </p>
          <p className="mt-0.5 text-xs font-medium text-neutral-600">
            {formatDateShort(order.createdAt)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            Estimated Date
          </p>
          <p className="mt-0.5 text-xs font-medium text-neutral-600">
            {formatDateShort(estimatedDate.toISOString())}
          </p>
        </div>
      </div>

      {/* Product info */}
      <div className="mt-4 border-t border-neutral-100 pt-4">
        <div className="flex gap-3">
          <Package
            className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400"
            strokeWidth={1.75}
          />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Item
            </p>
            <p className="mt-0.5 text-sm font-medium text-ink">
              {order.productDescription}
            </p>
          </div>
        </div>
      </div>

      {/* COD */}
      {order.codAmount > 0 && (
        <div className="mt-4 flex gap-3 border-t border-neutral-100 pt-4">
          <Banknote
            className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400"
            strokeWidth={1.75}
          />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              Cash on delivery
            </p>
            <p className="font-data text-data-md font-bold tabular-nums text-ink">
              {formatNaira(order.codAmount)}
            </p>
          </div>
        </div>
      )}

      {/* Delivery fee */}
      <div className="mt-3 flex items-baseline justify-between border-t border-neutral-100 pt-3">
        <p className="text-xs font-medium text-neutral-500">Delivery fee</p>
        <p className="font-data text-sm tabular-nums text-neutral-600">
          {formatNaira(order.deliveryFee)}
        </p>
      </div>
    </div>
  )
}
