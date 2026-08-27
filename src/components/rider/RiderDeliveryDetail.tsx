import { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Package,
  Phone,
  User,
} from 'lucide-react'
import { useAppData } from '../../context/AppContext'
import { formatNaira } from '../../data/mockData'
import type { OrderStatus } from '../../data/types'

interface RiderDeliveryDetailProps {
  orderId: string
  onBack: () => void
}

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

  // -- Success state --
  if (showSuccess) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center bg-white p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="mb-4 rounded-full bg-status-success-bg p-4">
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
      <div className="flex h-dvh flex-col bg-white">
        <header className="flex items-center border-b border-neutral-200 px-2 py-2">
          <button
            type="button"
            onClick={() => setShowOtp(false)}
            className="flex min-h-touch min-w-touch items-center justify-center rounded-full text-neutral-500 active:bg-neutral-100"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <span className="ml-2 font-heading font-semibold">Verify Delivery</span>
        </header>

        <div className="flex-1 p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-ink">Enter Code</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Ask the customer ({order.customerName}) for their 4-digit delivery PIN.
            </p>
          </div>

          <form onSubmit={handleOtpSubmit} className="mt-8 flex flex-col items-center">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="0000"
              className="w-48 rounded-xl border-2 border-neutral-300 bg-neutral-50 px-4 py-3 text-center font-data text-4xl font-bold tracking-widest text-ink focus:border-brand focus:bg-white focus:outline-none"
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

  // -- Detail State --
  return (
    <div className="flex h-dvh flex-col bg-neutral-50">
      <header className="flex items-center border-b border-neutral-200 bg-white px-2 py-2">
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-touch min-w-touch items-center justify-center rounded-full text-neutral-500 active:bg-neutral-100"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="ml-2">
          <p className="font-data text-xs font-bold text-neutral-500">
            {order.id}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-5">
          {/* Customer info */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Customer
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-brand-700" />
                  <p className="font-semibold text-ink">{order.customerName}</p>
                </div>
              </div>
              <a
                href="tel:+2348000000000"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors active:bg-brand-100"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-4 flex items-start gap-2 border-t border-neutral-100 pt-4">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
              <div>
                <p className="text-sm font-medium text-ink">
                  {order.customerAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Package details */}
          <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Package
            </p>
            <div className="mt-2 flex items-start gap-2">
              <Package className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
              <p className="text-sm font-medium text-ink">
                {order.productDescription}
              </p>
            </div>

            {order.codAmount > 0 && (
              <div className="mt-4 rounded-lg bg-status-warning-bg p-3">
                <p className="text-xs font-medium text-status-warning">
                  Cash on Delivery (COD) to collect:
                </p>
                <p className="mt-0.5 font-data text-xl font-bold text-status-warning">
                  {formatNaira(order.codAmount)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Action */}
      {isActive && (
        <div className="border-t border-neutral-200 bg-white p-4 pb-6">
          <button
            type="button"
            onClick={handleAction}
            className="flex w-full min-h-touch items-center justify-center rounded-xl bg-ink px-4 py-3.5 text-base font-bold text-white transition-opacity active:opacity-90"
          >
            {getActionLabel()}
          </button>
        </div>
      )}
    </div>
  )
}
