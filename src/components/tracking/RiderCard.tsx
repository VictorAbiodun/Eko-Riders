import { Phone, MessageCircle, User } from 'lucide-react'
import type { Rider } from '../../data/types'

interface RiderCardProps {
  rider: Rider
  /** Show ETA window for orders currently out for delivery */
  estimatedArrival?: { start: string; end: string } | null
}

/**
 * Delivery Partner row matching the reference UI:
 * Avatar + Name + Chat button + Call button (circular icon buttons)
 */
export function RiderCard({ rider, estimatedArrival }: RiderCardProps) {
  const initials = rider.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const telHref = `tel:${rider.phone.replace(/\s/g, '')}`

  return (
    <div className="mx-5 rounded-2xl border border-neutral-200 bg-white p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
        Delivery Partner
      </p>

      <div className="mt-3 flex items-center gap-3">
        {/* Avatar */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
          {initials}
        </div>

        {/* Name + vehicle type */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-ink">{rider.name}</p>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <User className="h-3 w-3" strokeWidth={2} />
            <span className="capitalize">{rider.vehicleType} rider</span>
          </div>
        </div>

        {/* Circular action buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition-colors active:bg-neutral-50"
            aria-label="Chat with rider"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2} />
          </button>
          <a
            href={telHref}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white transition-colors active:bg-ink/90"
            aria-label="Call rider"
          >
            <Phone className="h-4 w-4" strokeWidth={2} />
          </a>
        </div>
      </div>

      {/* Estimated arrival */}
      {estimatedArrival && (
        <div className="mt-4 rounded-xl bg-brand-50 px-4 py-3">
          <p className="text-xs font-medium text-neutral-500">
            Estimated arrival
          </p>
          <p className="font-data text-data-md font-bold tabular-nums text-ink">
            {estimatedArrival.start} — {estimatedArrival.end}
          </p>
        </div>
      )}
    </div>
  )
}
