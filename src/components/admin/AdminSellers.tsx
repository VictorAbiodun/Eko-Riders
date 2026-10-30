import { useState } from 'react'
import { MapPin, Package } from 'lucide-react'
import { useAppData } from '../../context/AppContext'

const PLAN_COLORS: Record<string, string> = {
  starter: 'bg-neutral-500 text-white',
  growth: 'bg-status-success text-white',
  business: 'bg-brand text-white',
}

function getPlan(totalOrders: number): string {
  if (totalOrders > 400) return 'business'
  if (totalOrders > 150) return 'growth'
  return 'starter'
}

function getPlanLimit(plan: string): number {
  if (plan === 'business') return 1000
  if (plan === 'growth') return 500
  return 200
}

export function AdminSellers() {
  const { sellers, orders } = useAppData()
  const [selectedSeller, setSelectedSeller] = useState<string | null>(null)

  const selected = selectedSeller
    ? sellers.find((s) => s.id === selectedSeller)
    : null

  if (selected) {
    const plan = getPlan(selected.totalOrders)
    const limit = getPlanLimit(plan)
    const sellerOrders = orders
      .filter((o) => o.sellerName === selected.businessName)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )

    return (
      <div className="p-5 md:p-8">
        <button
          type="button"
          onClick={() => setSelectedSeller(null)}
          className="mb-6 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          ← Back to sellers
        </button>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
                {selected.businessName[0]}
              </div>
              <div>
                <h2 className="text-lg font-bold text-ink">
                  {selected.businessName}
                </h2>
                <p className="text-sm text-neutral-500">{selected.name}</p>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-neutral-600">
                <MapPin className="h-4 w-4 text-neutral-400" />
                {selected.area}
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Package className="h-4 w-4 text-neutral-400" />
                {selected.totalOrders} lifetime orders
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${PLAN_COLORS[plan]}`}
                >
                  {plan} Plan
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-ink mb-4">Usage</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-neutral-500">Deliveries used</span>
                  <span className="font-data font-bold text-ink">
                    {selected.totalOrders} / {limit}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand transition-all"
                    style={{
                      width: `${Math.min((selected.totalOrders / limit) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Recent Orders
                </p>
                <p className="font-data text-2xl font-bold text-ink">
                  {sellerOrders.length}
                </p>
                <p className="text-xs text-neutral-500">in this demo dataset</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-neutral-200 bg-white px-5 py-5 md:px-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">
          Sellers
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {sellers.length} registered sellers
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50">
              <tr className="border-b border-neutral-200 text-left">
                <th className="px-8 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Business
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Plan
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Area
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Usage
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-right pr-8">
                  Total Orders
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {sellers.map((seller) => {
                const plan = getPlan(seller.totalOrders)
                const limit = getPlanLimit(plan)
                const pct = Math.min((seller.totalOrders / limit) * 100, 100)

                return (
                  <tr
                    key={seller.id}
                    onClick={() => setSelectedSeller(seller.id)}
                    className="cursor-pointer transition-colors hover:bg-neutral-50"
                  >
                    <td className="px-8 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">
                          {seller.businessName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-ink">
                            {seller.businessName}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {seller.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${PLAN_COLORS[plan]}`}
                      >
                        {plan}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-neutral-700">
                      {seller.area}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="w-24">
                        <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-brand"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="mt-0.5 text-[10px] text-neutral-400">
                          {seller.totalOrders}/{limit}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-data font-bold text-ink pr-8">
                      {seller.totalOrders}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-neutral-100 bg-white">
          {sellers.map((seller) => {
            const plan = getPlan(seller.totalOrders)
            return (
              <button
                key={seller.id}
                type="button"
                onClick={() => setSelectedSeller(seller.id)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left active:bg-neutral-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-sm font-bold text-brand-700">
                  {seller.businessName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-ink truncate">
                      {seller.businessName}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${PLAN_COLORS[plan]}`}
                    >
                      {plan}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {seller.area} · {seller.totalOrders} orders
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
