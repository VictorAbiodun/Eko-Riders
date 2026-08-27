import { MapPin, User, Package, CircleDollarSign, Bike } from 'lucide-react'
import { useAppData } from '../../context/AppContext'
import { formatNaira } from '../../data/mockData'
import { StatusBadge } from '../ui/StatusBadge'
import { TrackingStepper } from '../tracking/TrackingStepper'

interface SellerOrderDetailProps {
  orderId: string
}

export function SellerOrderDetail({ orderId }: SellerOrderDetailProps) {
  const { orders } = useAppData()
  const order = orders.find((o) => o.id === orderId)

  if (!order) return null

  return (
    <div className="flex flex-col gap-6 p-5 md:p-8 md:max-w-4xl md:mx-auto w-full">
      {/* ── Order Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-white border border-neutral-200 p-5 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Order ID
          </h2>
          <p className="mt-1 font-data text-2xl font-bold text-ink">
            {order.id}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-500">Status</span>
          <StatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* ── Left Column: Details ── */}
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
                <p className="font-medium text-ink flex items-start gap-1">
                  <MapPin className="h-4 w-4 shrink-0 text-brand mt-0.5" />
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
                <p className="text-neutral-500 flex items-center gap-1">
                  <CircleDollarSign className="h-3.5 w-3.5" />
                  Value to collect
                </p>
                <p className="font-data text-lg font-bold text-ink">
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
            ) : (
              <p className="text-sm text-neutral-500 italic">No rider assigned yet</p>
            )}
          </div>
        </div>

        {/* ── Right Column: Tracking ── */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:h-fit">
          <h3 className="mb-6 flex items-center gap-2 text-sm font-bold text-ink border-b border-neutral-100 pb-4">
            Order Timeline
          </h3>
          <TrackingStepper status={order.status} createdAt={order.createdAt} />
        </div>
      </div>
    </div>
  )
}
