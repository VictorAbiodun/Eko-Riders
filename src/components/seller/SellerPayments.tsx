import { formatNaira } from '../../data/mockData'
import type { Seller } from '../../data/types'
import { useAppData } from '../../context/AppContext'
import { Wallet, Banknote, ArrowDownToLine } from 'lucide-react'

interface SellerPaymentsProps {
  seller: Seller
}

export function SellerPayments({ seller }: SellerPaymentsProps) {
  const { orders } = useAppData()

  const sellerOrders = orders.filter(
    (o) => o.sellerName === seller.businessName,
  )

  const pendingSettlement = sellerOrders
    .filter(
      (o) =>
        o.codAmount > 0 &&
        o.status !== 'DELIVERED' &&
        o.status !== 'FAILED' &&
        o.status !== 'RETURNED',
    )
    .reduce((sum, o) => sum + o.codAmount, 0)

  const codCollected = sellerOrders
    .filter((o) => o.codAmount > 0 && o.status === 'DELIVERED')
    .reduce((sum, o) => sum + o.codAmount, 0)

  // Mock settled amount (all delivered minus recent)
  const settled = Math.max(0, codCollected - 5000)
  const availableToWithdraw = codCollected - settled

  // Mock transactions based on delivered orders with COD
  const transactions = sellerOrders
    .filter((o) => o.codAmount > 0 && o.status === 'DELIVERED')
    .slice(0, 10)

  return (
    <div className="flex flex-col gap-6 p-5 md:p-8 md:max-w-4xl md:mx-auto w-full">
      <div className="md:hidden">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">
          Payments
        </h1>
        <p className="mt-1 text-sm text-neutral-500">Manage your earnings</p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-ink p-5 text-white shadow-sm sm:col-span-3 lg:col-span-1">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-neutral-400" />
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-300">
              Available to Withdraw
            </p>
          </div>
          <p className="mt-2 font-data text-3xl font-bold tracking-tight">
            {formatNaira(availableToWithdraw)}
          </p>
          <button className="mt-4 w-full rounded-lg bg-white px-4 py-2 text-sm font-bold text-ink transition-opacity hover:opacity-90">
            Withdraw Funds
          </button>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-brand-700" />
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Pending Settlement
            </p>
          </div>
          <p className="mt-2 font-data text-2xl font-bold text-ink">
            {formatNaira(pendingSettlement)}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            From active deliveries
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ArrowDownToLine className="h-4 w-4 text-status-success" />
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Total Settled
            </p>
          </div>
          <p className="mt-2 font-data text-2xl font-bold text-ink">
            {formatNaira(settled)}
          </p>
          <p className="mt-1 text-xs text-neutral-400">All-time payouts</p>
        </div>
      </div>

      {/* ── Transaction List ── */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-sm font-bold text-ink">Recent Transactions</h2>
        </div>
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-500">
            No transactions found.
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-success-bg">
                    <ArrowDownToLine className="h-5 w-5 text-status-success" />
                  </div>
                  <div>
                    <p className="font-bold text-ink text-sm">COD Collected</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{tx.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-data font-bold text-status-success text-sm">
                    +{formatNaira(tx.codAmount)}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
