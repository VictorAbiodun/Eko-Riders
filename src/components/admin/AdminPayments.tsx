import { useState } from 'react'
import { Banknote, Clock, CheckCircle2, ArrowRight } from 'lucide-react'
import { useAppData } from '../../context/AppContext'
import { formatNaira } from '../../data/mockData'
import { StatusBadge } from '../ui/StatusBadge'

export function AdminPayments() {
  const { orders } = useAppData()
  const [settledIds, setSettledIds] = useState<Set<string>>(new Set())

  // Platform-wide COD totals
  const codOrders = orders.filter((o) => o.codAmount > 0)
  const collected = codOrders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((s, o) => s + o.codAmount, 0)
  const pending = codOrders
    .filter((o) => o.status === 'DELIVERED' && !settledIds.has(o.id))
    .reduce((s, o) => s + o.codAmount, 0)
  const settled = codOrders
    .filter((o) => settledIds.has(o.id))
    .reduce((s, o) => s + o.codAmount, 0)

  // Transaction rows
  const transactions = codOrders
    .filter(
      (o) =>
        o.status === 'DELIVERED' ||
        ['PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.status),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

  const handleSettle = (orderId: string) => {
    setSettledIds((prev) => new Set([...prev, orderId]))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-neutral-200 bg-white px-5 py-5 md:px-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">
          Payments
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Platform-wide COD settlements
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 md:p-8">
        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
          <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-status-success-bg">
              <Banknote
                className="h-6 w-6 text-status-success"
                strokeWidth={1.75}
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                COD Collected
              </p>
              <p className="mt-0.5 font-data text-xl font-bold tabular-nums text-ink">
                {formatNaira(collected)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-status-warning-bg">
              <Clock
                className="h-6 w-6 text-status-warning"
                strokeWidth={1.75}
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Pending Settlement
              </p>
              <p className="mt-0.5 font-data text-xl font-bold tabular-nums text-ink">
                {formatNaira(pending)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50">
              <CheckCircle2
                className="h-6 w-6 text-brand-600"
                strokeWidth={1.75}
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Settled
              </p>
              <p className="mt-0.5 font-data text-xl font-bold tabular-nums text-ink">
                {formatNaira(settled)}
              </p>
            </div>
          </div>
        </div>

        {/* Transactions table */}
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h2 className="text-sm font-bold text-ink">Transactions</h2>
          </div>

          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left bg-neutral-50">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Seller
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-right">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-right pr-5">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {transactions.map((order) => {
                  const isSettled = settledIds.has(order.id)
                  const canSettle = order.status === 'DELIVERED' && !isSettled

                  return (
                    <tr key={order.id} className="hover:bg-neutral-50">
                      <td className="px-5 py-3.5 font-data font-bold text-ink">
                        {order.id}
                      </td>
                      <td className="px-4 py-3.5 text-neutral-700">
                        {order.sellerName}
                      </td>
                      <td className="px-4 py-3.5 text-right font-data font-bold tabular-nums text-ink">
                        {formatNaira(order.codAmount)}
                      </td>
                      <td className="px-4 py-3.5">
                        {isSettled ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                            <CheckCircle2 className="h-3 w-3" /> Settled
                          </span>
                        ) : (
                          <StatusBadge status={order.status} />
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right pr-5">
                        {canSettle ? (
                          <button
                            type="button"
                            onClick={() => handleSettle(order.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-600 transition-colors"
                          >
                            Settle <ArrowRight className="h-3 w-3" />
                          </button>
                        ) : isSettled ? (
                          <span className="text-xs text-neutral-400">Done</span>
                        ) : (
                          <span className="text-xs text-neutral-400">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-neutral-100">
            {transactions.map((order) => {
              const isSettled = settledIds.has(order.id)
              const canSettle = order.status === 'DELIVERED' && !isSettled

              return (
                <div key={order.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-data text-sm font-bold text-ink">
                      {order.id}
                    </span>
                    {isSettled ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                        <CheckCircle2 className="h-3 w-3" /> Settled
                      </span>
                    ) : (
                      <StatusBadge status={order.status} />
                    )}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
                    <span>{order.sellerName}</span>
                    <span className="font-data font-bold text-ink">
                      {formatNaira(order.codAmount)}
                    </span>
                  </div>
                  {canSettle && (
                    <button
                      type="button"
                      onClick={() => handleSettle(order.id)}
                      className="mt-2 inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white"
                    >
                      Settle Seller <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
