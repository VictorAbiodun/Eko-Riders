import { useState } from 'react'
import { ChevronDown, MapPin, Package, Banknote } from 'lucide-react'
import type { Order } from '../../data/types'
import { formatNaira } from '../../data/mockData'

interface OrderSummaryCardProps {
  order: Order
}

export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mx-5 overflow-hidden rounded-xl border border-neutral-200 bg-white">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex min-h-touch w-full items-center justify-between px-4 py-3 text-left transition-colors active:bg-neutral-50"
      >
        <span className="text-sm font-semibold text-ink">Order details</span>
        <ChevronDown
          className={`h-4.5 w-4.5 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
          strokeWidth={2}
        />
      </button>

      {/* Expandable content */}
      <div
        className={`grid transition-all duration-250 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-neutral-100 px-4 py-4">
            {/* Product */}
            <div className="flex gap-3">
              <Package
                className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400"
                strokeWidth={1.75}
              />
              <div>
                <p className="text-xs font-medium text-neutral-500">Item</p>
                <p className="text-sm font-medium text-ink">
                  {order.productDescription}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="mt-4 flex gap-3">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400"
                strokeWidth={1.75}
              />
              <div>
                <p className="text-xs font-medium text-neutral-500">
                  Delivery address
                </p>
                <p className="text-sm font-medium text-ink">
                  {order.customerAddress}
                </p>
              </div>
            </div>

            {/* COD */}
            {order.codAmount > 0 && (
              <div className="mt-4 flex gap-3">
                <Banknote
                  className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400"
                  strokeWidth={1.75}
                />
                <div>
                  <p className="text-xs font-medium text-neutral-500">
                    Cash on delivery
                  </p>
                  <p className="font-data text-data-md font-bold tabular-nums text-ink">
                    {formatNaira(order.codAmount)}
                  </p>
                </div>
              </div>
            )}

            {/* Delivery fee */}
            <div className="mt-4 flex gap-3">
              <div className="h-4 w-4 shrink-0" />
              <div className="flex items-baseline justify-between w-full">
                <p className="text-xs font-medium text-neutral-500">
                  Delivery fee
                </p>
                <p className="font-data text-sm tabular-nums text-neutral-600">
                  {formatNaira(order.deliveryFee)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
