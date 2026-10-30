import { useState } from 'react'
import { CheckCircle2, Package, MapPin, User, Banknote } from 'lucide-react'
import type { Seller, Order } from '../../data/types'
import { useAppData } from '../../context/AppContext'
import { nextOrderId } from '../../data/mockData'

interface SellerCreateOrderProps {
  seller: Seller
  onSuccess: () => void
}

export function SellerCreateOrder({
  seller,
  onSuccess,
}: SellerCreateOrderProps) {
  const { orders, setOrders } = useAppData()

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [packageValue, setPackageValue] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'PREPAID' | 'COD'>(
    'PREPAID',
  )

  const [showSuccess, setShowSuccess] = useState(false)

  const deliveryFee = 1500

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newOrderId = nextOrderId(orders.map((o) => o.id))

    const newOrder: Order = {
      id: newOrderId,
      status: 'NEW',
      sellerName: seller.businessName,
      customerName,
      customerAddress,
      riderName: null,
      productDescription,
      codAmount:
        paymentMethod === 'COD' ? Number(packageValue) + deliveryFee : 0,
      deliveryFee,
      createdAt: new Date().toISOString(),
    }

    setOrders((prev) => [newOrder, ...prev])
    setShowSuccess(true)

    setTimeout(() => {
      onSuccess()
    }, 2000)
  }

  if (showSuccess) {
    return (
      <div className="flex h-[calc(100vh-120px)] flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="mb-4 rounded-full bg-status-success-bg p-4">
          <CheckCircle2 className="h-16 w-16 text-status-success" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-ink">
          Order Created!
        </h2>
        <p className="mt-2 text-neutral-500">
          Your order has been saved and will be assigned to a rider shortly.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl p-5 md:p-8">
      <div className="mb-6 md:hidden">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">
          Create Order
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Details */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
            <User className="h-4 w-4 text-neutral-400" />
            Customer Details
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Name
              </label>
              <input
                required
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Odunlade Adekola"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Phone Number
              </label>
              <input
                required
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Delivery Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <input
                  required
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="14 Admiralty Way, Lekki Phase 1, Lagos"
                  className="w-full rounded-lg border border-neutral-200 py-2 pl-9 pr-3 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
            <Package className="h-4 w-4 text-neutral-400" />
            Package Details
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Product Description
              </label>
              <input
                required
                type="text"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Ankara two-piece set (Size M)"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Package Value (₦)
              </label>
              <input
                required
                type="number"
                min="0"
                value={packageValue}
                onChange={(e) => setPackageValue(e.target.value)}
                placeholder="15000"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-data text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
            <Banknote className="h-4 w-4 text-neutral-400" />
            Payment Method
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('PREPAID')}
              className={`rounded-lg border-2 px-4 py-3 text-center transition-colors ${
                paymentMethod === 'PREPAID'
                  ? 'border-brand bg-brand-50 text-brand-700'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <span className="block text-sm font-bold">Prepaid</span>
              <span className="mt-0.5 block text-xs font-medium opacity-80">
                Customer paid already
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('COD')}
              className={`rounded-lg border-2 px-4 py-3 text-center transition-colors ${
                paymentMethod === 'COD'
                  ? 'border-brand bg-brand-50 text-brand-700'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <span className="block text-sm font-bold">Pay on Delivery</span>
              <span className="mt-0.5 block text-xs font-medium opacity-80">
                Rider collects cash
              </span>
            </button>
          </div>

          <div className="mt-5 rounded-lg bg-neutral-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Delivery Fee (Fixed)</span>
              <span className="font-data font-medium text-ink">₦1,500</span>
            </div>
            {paymentMethod === 'COD' && packageValue && (
              <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 text-sm font-bold">
                <span className="text-ink">Total to Collect</span>
                <span className="font-data text-brand-700">
                  ₦{(Number(packageValue) + 1500).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="flex min-h-touch w-full items-center justify-center rounded-xl bg-ink px-4 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-neutral-800 active:scale-[0.98]"
        >
          Create Order
        </button>
      </form>
    </div>
  )
}
