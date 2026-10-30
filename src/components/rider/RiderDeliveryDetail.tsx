import { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Package,
  Phone,
  MessageCircle,
  ChevronRight,
} from 'lucide-react'
import { useAppData } from '../../context/AppContext'
import { formatNaira } from '../../data/mockData'
import type { OrderStatus } from '../../data/types'
import { MapGraphic } from '../ui/MapGraphic'
import { TrackingStepper } from '../orders/TrackingStepper'

interface RiderDeliveryDetailProps {
  orderId: string
  onBack: () => void
}

/* ─── Date formatter ─── */

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/* ─── Main component ─── */

export function RiderDeliveryDetail({
  orderId,
  onBack,
}: RiderDeliveryDetailProps) {
  const { orders, setOrders } = useAppData()
  const order = orders.find((o) => o.id === orderId)

  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  if (!order) return null

  const updateStatus = (newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    )
  }

  const handleAction = () => {
    switch (order.status) {
      case 'ASSIGNED':
        updateStatus('PICKED_UP')
        break
      case 'PICKED_UP':
        updateStatus('OUT_FOR_DELIVERY')
        break
      case 'OUT_FOR_DELIVERY':
        setShowOtp(true)
        break
      default:
        break
    }
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length === 4) {
      setShowOtp(false)
      updateStatus('DELIVERED')
      setShowSuccess(true)
      setTimeout(() => {
        onBack()
      }, 2000)
    }
  }

  const getActionLabel = () => {
    switch (order.status) {
      case 'ASSIGNED':
        return 'Arrived at Pickup'
      case 'PICKED_UP':
        return 'Start Delivery'
      case 'OUT_FOR_DELIVERY':
        return 'Complete Delivery'
      default:
        return 'Delivery Completed'
    }
  }

  const isActive = ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(
    order.status,
  )

  // Pickup area (simplified for demo)
  const pickupArea = 'Lekki Phase 1, Lagos'
  const dropoffMatch = order.customerAddress.match(
    /([^,]+,\s*[^,]+),\s*Lagos$/i,
  )
  const dropoffArea = dropoffMatch
    ? `${dropoffMatch[1]}, Lagos`
    : order.customerAddress

  // Estimated date
  const estimatedDate = new Date(
    new Date(order.createdAt).getTime() + 2 * 60 * 60 * 1000,
  )

  // Rider initials
  const riderInitials = order.riderName
    ? order.riderName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'SF'

  // -- Success state --
  if (showSuccess) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center bg-white p-6 text-center">
        <div
          className="mb-4 rounded-full bg-status-success-bg p-4"
          style={{ animation: 'card-enter 0.4s ease-out both' }}
        >
          <CheckCircle2 className="h-16 w-16 text-status-success" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-ink">
          Delivery Completed!
        </h2>
        <p className="mt-2 text-neutral-500">
          Great job. Returning to your deliveries list...
        </p>
      </div>
    )
  }

  // -- OTP State --
  if (showOtp) {
    return (
      <div className="flex h-dvh flex-col bg-neutral-50">
        <header className="flex items-center border-b border-neutral-200 bg-white px-2 py-2">
          <button
            type="button"
            onClick={() => setShowOtp(false)}
            className="flex min-h-touch min-w-touch items-center justify-center rounded-full text-neutral-500 active:bg-neutral-100"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <span className="ml-2 font-heading font-semibold">
            Verify Delivery
          </span>
        </header>

        <div className="flex-1 p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-ink">Enter Code</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Ask the customer ({order.customerName}) for their 4-digit delivery
              PIN.
            </p>
          </div>

          <form
            onSubmit={handleOtpSubmit}
            className="mt-8 flex flex-col items-center"
          >
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="0000"
              className="w-48 rounded-xl border-2 border-neutral-300 bg-white px-4 py-3 text-center font-data text-4xl font-bold tracking-widest text-ink focus:border-brand focus:bg-white focus:outline-none"
              autoFocus
            />

            <button
              type="submit"
              disabled={otp.length !== 4}
              className="mt-8 flex w-full min-h-touch items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white transition-opacity disabled:opacity-50 active:opacity-90"
            >
              Verify & Complete
            </button>
          </form>
        </div>
      </div>
    )
  }

  // -- Detail State (Reference UI layout) --
  return (
    <div className="flex h-dvh flex-col bg-neutral-50">
      {/* Header */}
      <header
        className="flex items-center bg-white px-2 py-2"
        style={{
          boxShadow: '0 1px 8px -2px rgba(30, 28, 26, 0.06)',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-touch min-w-touch items-center justify-center rounded-full text-neutral-500 active:bg-neutral-100"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
        </button>
        <h1 className="flex-1 text-center font-heading text-base font-semibold text-ink">
          Tracking Shipment
        </h1>
        <div className="w-11" /> {/* Spacer for centering */}
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Map card */}
        <div className="px-5 pt-5">
          <MapGraphic status={order.status} className="h-[200px]" />
        </div>

        {/* Order ID centered */}
        <div className="px-5 pt-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Order ID
          </p>
          <p className="mt-1 font-data text-2xl font-bold tabular-nums tracking-tight text-ink">
            {order.id}
          </p>
        </div>

        {/* From / To address card */}
        <div className="mx-5 mt-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                From
              </p>
              <p className="mt-1 text-sm font-bold leading-snug text-ink">
                {pickupArea}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
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
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Placed by
              </p>
              <p className="mt-0.5 text-sm font-medium text-neutral-600">
                {formatDateShort(order.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Estimated Date
              </p>
              <p className="mt-0.5 text-sm font-medium text-neutral-600">
                {formatDateShort(estimatedDate.toISOString())}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-neutral-100 pt-2">
            <TrackingStepper status={order.status} variant="compact" />
          </div>
        </div>

        <div className="mx-5 mt-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Delivery Partner
          </p>
          <div className="mt-3 flex items-center gap-3">
            {/* Avatar */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              {riderInitials}
            </div>

            {/* Name */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-bold text-ink">
                {order.riderName ?? 'Unassigned'}
              </p>
              <p className="text-xs text-neutral-500">Dispatch rider</p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition-colors active:bg-neutral-50"
                aria-label="Chat"
              >
                <MessageCircle className="h-4.5 w-4.5" strokeWidth={2} />
              </button>
              <a
                href="tel:+2348000000000"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white transition-colors active:bg-ink/90"
                aria-label="Call"
              >
                <Phone className="h-4.5 w-4.5" strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>

        {/* COD notice */}
        {order.codAmount > 0 && (
          <div className="mx-5 mt-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Package
            </p>
            <div className="mt-2 flex items-start gap-2">
              <Package
                className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400"
                strokeWidth={1.75}
              />
              <p className="text-sm font-medium text-ink">
                {order.productDescription}
              </p>
            </div>
            <div className="mt-3 rounded-xl bg-status-warning-bg p-3">
              <p className="text-xs font-medium text-status-warning">
                Cash on Delivery (COD) to collect:
              </p>
              <p className="mt-0.5 font-data text-xl font-bold text-status-warning">
                {formatNaira(order.codAmount)}
              </p>
            </div>
          </div>
        )}

        {/* Live Tracking CTA */}
        {isActive && (
          <div className="mx-5 mt-4 mb-6">
            <button
              type="button"
              className="card-press flex min-h-touch w-full items-center justify-between rounded-xl bg-brand px-5 py-4 text-white transition-all active:opacity-90"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <MapPin className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <span className="text-base font-bold">Live Tracking</span>
              </div>
              <ChevronRight
                className="h-5 w-5 text-white/70"
                strokeWidth={2.5}
              />
            </button>
          </div>
        )}
      </div>

      {/* Footer Action */}
      {isActive && (
        <div
          className="bg-white p-5 pb-6"
          style={{
            boxShadow: '0 -4px 20px -4px rgba(30, 28, 26, 0.06)',
          }}
        >
          <button
            type="button"
            onClick={handleAction}
            className="flex min-h-touch w-full items-center justify-center rounded-xl bg-ink px-4 py-4 text-base font-bold text-white transition-opacity active:opacity-90"
          >
            {getActionLabel()}
          </button>
        </div>
      )}
    </div>
  )
}
