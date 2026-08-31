import { useState } from 'react'
import { MapPin, User, Package, CircleDollarSign, Bike } from 'lucide-react'
import { useAppData } from '../../context/AppContext'
import { formatNaira } from '../../data/mockData'
import { StatusBadge } from '../ui/StatusBadge'
import { TrackingStepper } from '../orders/TrackingStepper'
import type { OrderStatus } from '../../data/types'

interface SellerOrderDetailProps {
  orderId: string
  /** Admin/dispatcher can assign an unassigned NEW/CONFIRMED order */
  canDispatch?: boolean
}

export function SellerOrderDetail({ orderId, canDispatch }: SellerOrderDetailProps) {
  const { orders, riders, setOrders } = useAppData()
  const order = orders.find((o) => o.id === orderId)
  const [riderId, setRiderId] = useState('')

  if (!order) return null

  const canAssign =
    canDispatch &&
    !order.riderName &&
    ['NEW', 'CONFIRMED'].includes(order.status)

  const assignRider = () => {
    const rider = riders.find((r) => r.id === riderId)
    if (!rider) return
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, riderName: rider.name, status: 'ASSIGNED' as OrderStatus }
          : o,
      ),
    )
  }

  return (
    <div className="flex w-full flex-col gap-6 p-4 md:mx-auto md:max-w-4xl md:p-8">
      <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Order ID
          </h2>
          <p className="mt-1 font-data text-2xl font-bold tabular-nums text-ink">
            {order.id}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-500">Status</span>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
              <User className="h-4 w-4 text-neutral-400" />
              Customer Details
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-neutral-500">Name</p>
                <p className="font-semibold text-ink">{order.customerName}</p>
              </div>
              <div>
                <p className="text-neutral-500">Address</p>
                <p className="flex items-start gap-1 font-medium text-ink">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {order.customerAddress}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
              <Package className="h-4 w-4 text-neutral-400" />
              Package & Payment
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-neutral-500">Description</p>
                <p className="font-semibold text-ink">{order.productDescription}</p>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                <p className="text-neutral-500">Payment Method</p>
                {order.codAmount > 0 ? (
                  <span className="font-bold text-status-warning">Pay on Delivery</span>
                ) : (
                  <span className="font-bold text-brand-700">Prepaid</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1 text-neutral-500">
                  <CircleDollarSign className="h-3.5 w-3.5" />
                  Value to collect
                </p>
                <p className="font-data text-lg font-bold tabular-nums text-ink">
                  {formatNaira(order.codAmount)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-neutral-500">Delivery Fee</p>
                <p className="font-data font-medium text-ink">
                  {formatNaira(order.deliveryFee)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
              <Bike className="h-4 w-4 text-neutral-400" />
              Assigned Rider
            </h3>
            {order.riderName ? (
              <p className="font-semibold text-ink">{order.riderName}</p>
            ) : canAssign ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={riderId}
                  onChange={(e) => setRiderId(e.target.value)}
                  className="min-h-touch flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="">Select a rider</option>
                  {riders
                    .filter((r) => r.status !== 'offline')
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} · {r.currentZone} ({r.status === 'available' ? 'Available' : 'Busy'})
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  disabled={!riderId}
                  onClick={assignRider}
                  className="min-h-touch rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white disabled:opacity-40"
                >
                  Assign
                </button>
              </div>
            ) : (
              <p className="text-sm text-neutral-500 italic">No rider assigned yet</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:h-fit">
          <h3 className="mb-2 border-b border-neutral-100 pb-4 text-sm font-bold text-ink">
            Order Timeline
          </h3>
          <TrackingStepper status={order.status} />
        </div>
      </div>
    </div>
  )
}
