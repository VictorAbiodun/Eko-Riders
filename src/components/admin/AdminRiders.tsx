import { useState } from 'react'
import { User, Phone, MapPin, Bike as BikeIcon, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { useAppData } from '../../context/AppContext'
import { EmptyState } from '../ui/EmptyState'
import type { Rider } from '../../data/types'

type RiderFilter = 'all' | 'available' | 'on_delivery' | 'offline'

const FILTERS: { id: RiderFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'available', label: 'Available' },
  { id: 'on_delivery', label: 'Busy' },
  { id: 'offline', label: 'Offline' },
]

function RiderStatusDot({ status }: { status: Rider['status'] }) {
  const colors: Record<Rider['status'], string> = {
    available: 'bg-status-success',
    on_delivery: 'bg-status-info',
    offline: 'bg-neutral-400',
  }
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${colors[status]}`} />
}

function RiderStatusLabel({ status }: { status: Rider['status'] }) {
  const labels: Record<Rider['status'], string> = {
    available: 'Available',
    on_delivery: 'On Delivery',
    offline: 'Offline',
  }
  return <span className="text-sm font-medium text-neutral-600">{labels[status]}</span>
}

export function AdminRiders() {
  const { riders, orders } = useAppData()
  const [filter, setFilter] = useState<RiderFilter>('all')
  const [selectedRider, setSelectedRider] = useState<string | null>(null)

  const filteredRiders = filter === 'all'
    ? riders
    : riders.filter((r) => r.status === filter)

  const selected = selectedRider ? riders.find((r) => r.id === selectedRider) : null

  if (selected) {
    const riderOrders = orders.filter((o) => o.riderName === selected.name)
    const completedOrders = riderOrders.filter((o) => o.status === 'DELIVERED')
    const activeOrders = riderOrders.filter((o) =>
      ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.status),
    )

    return (
      <div className="p-5 md:p-8">
        <button
          type="button"
          onClick={() => setSelectedRider(null)}
          className="mb-6 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          ← Back to riders
        </button>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Profile card */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
                {selected.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-lg font-bold text-ink">{selected.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <RiderStatusDot status={selected.status} />
                  <RiderStatusLabel status={selected.status} />
                </div>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-neutral-600">
                <Phone className="h-4 w-4 text-neutral-400" />
                {selected.phone}
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <BikeIcon className="h-4 w-4 text-neutral-400" />
                <span className="capitalize">{selected.vehicleType}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <MapPin className="h-4 w-4 text-neutral-400" />
                {selected.currentZone}
              </div>
            </div>
          </div>

          {/* Stats card */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-ink mb-4">Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Active Orders</p>
                <p className="mt-1 font-data text-2xl font-bold text-ink">{activeOrders.length}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Completed</p>
                <p className="mt-1 font-data text-2xl font-bold text-status-success">{completedOrders.length}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Assigned</p>
                <p className="mt-1 font-data text-2xl font-bold text-ink">{riderOrders.length}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Today</p>
                <p className="mt-1 font-data text-2xl font-bold text-brand-600">{selected.completedToday}</p>
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
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">Riders</h1>
        <p className="mt-1 text-sm text-neutral-500">{riders.length} registered riders</p>
      </div>

      <div className="border-b border-neutral-200 bg-white px-5 py-3 md:px-8">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                filter === f.id
                  ? 'bg-ink text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredRiders.length === 0 ? (
          <EmptyState
            title="No riders found"
            description="No riders match this filter."
          />
        ) : (
        <>
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50">
              <tr className="border-b border-neutral-200 text-left">
                <th className="px-8 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Rider</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Vehicle</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">Zone</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-right">Active Orders</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-400 text-right pr-8">Today</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {filteredRiders.map((rider) => {
                const activeCount = orders.filter(
                  (o) => o.riderName === rider.name && ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.status),
                ).length
                return (
                  <tr
                    key={rider.id}
                    onClick={() => setSelectedRider(rider.id)}
                    className="cursor-pointer transition-colors hover:bg-neutral-50"
                  >
                    <td className="px-8 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                          {rider.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="font-semibold text-ink">{rider.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <RiderStatusDot status={rider.status} />
                        <RiderStatusLabel status={rider.status} />
                      </div>
                    </td>
                    <td className="px-4 py-3.5 capitalize text-neutral-700">{rider.vehicleType}</td>
                    <td className="px-4 py-3.5 text-neutral-700">{rider.currentZone}</td>
                    <td className="px-4 py-3.5 text-right font-data font-bold text-ink">{activeCount}</td>
                    <td className="px-4 py-3.5 text-right font-data text-neutral-600 pr-8">{rider.completedToday}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-neutral-100 bg-white">
          {filteredRiders.map((rider) => {
            const activeCount = orders.filter(
              (o) => o.riderName === rider.name && ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.status),
            ).length
            return (
              <button
                key={rider.id}
                type="button"
                onClick={() => setSelectedRider(rider.id)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left active:bg-neutral-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {rider.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-ink truncate">{rider.name}</span>
                    <div className="flex items-center gap-1.5">
                      <RiderStatusDot status={rider.status} />
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                    <span className="capitalize">{rider.vehicleType}</span>
                    <span>·</span>
                    <span>{rider.currentZone}</span>
                    {activeCount > 0 && (
                      <>
                        <span>·</span>
                        <span className="font-semibold text-brand-600">{activeCount} active</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        </>
        )}
      </div>
    </div>
  )
}
