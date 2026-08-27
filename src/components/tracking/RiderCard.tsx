import { Phone, User } from 'lucide-react'
import type { Rider } from '../../data/types'

interface RiderCardProps {
  rider: Rider
  /** Show ETA window for orders currently out for delivery */
  estimatedArrival?: { start: string; end: string } | null
}

export function RiderCard({ rider, estimatedArrival }: RiderCardProps) {
  const initials = rider.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const telHref = `tel:${rider.phone.replace(/\s/g, '')}`

  return (
    <div className="mx-5 rounded-xl border border-neutral-200 bg-white p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Your rider
      </h3>

      <div className="flex items-center gap-3">
        {/* Avatar placeholder */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">
            {rider.name}
          </p>
          <div className="flex items-center gap-1.5 text-sm text-neutral-500">
            <User className="h-3.5 w-3.5" strokeWidth={2} />
            <span className="capitalize">{rider.vehicleType} rider</span>
          </div>
        </div>
      </div>

      {/* Estimated arrival */}
      {estimatedArrival && (
        <div className="mt-3 rounded-lg bg-brand-50 px-3 py-2.5">
          <p className="text-xs font-medium text-neutral-500">
            Estimated arrival
          </p>
          <p className="font-data text-data-md font-bold tabular-nums text-ink">
            {estimatedArrival.start} — {estimatedArrival.end}
          </p>
        </div>
      )}

      {/* Call rider button */}
      <a
        href={telHref}
        className="mt-3 flex min-h-touch w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white text-sm font-semibold text-ink transition-colors active:bg-neutral-50"
      >
        <Phone className="h-4 w-4" strokeWidth={2} />
        Call rider
      </a>
    </div>
  )
}
