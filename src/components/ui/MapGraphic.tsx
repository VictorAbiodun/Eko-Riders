import type { OrderStatus } from '../../data/types'
import { StatusBadge } from './StatusBadge'

interface MapGraphicProps {
  status?: OrderStatus
  className?: string
}

/**
 * Stylized SVG map placeholder with abstract road lines and location markers.
 * Matches the reference UI's big rounded map card at top of detail screens.
 * Uses danfo palette: cream/teal tones, mustard markers.
 */
export function MapGraphic({ status, className = '' }: MapGraphicProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{ minHeight: '200px' }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-100 via-neutral-100 to-accent-50" />

      {/* SVG map pattern */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Grid lines — subtle road network */}
        <g stroke="#C7D4DF" strokeWidth="0.75" opacity="0.5">
          {/* Horizontal roads */}
          <line x1="0" y1="40" x2="400" y2="40" />
          <line x1="0" y1="80" x2="400" y2="80" />
          <line x1="0" y1="120" x2="400" y2="120" />
          <line x1="0" y1="160" x2="400" y2="160" />
          <line x1="0" y1="200" x2="400" y2="200" />
          {/* Vertical roads */}
          <line x1="60" y1="0" x2="60" y2="220" />
          <line x1="130" y1="0" x2="130" y2="220" />
          <line x1="200" y1="0" x2="200" y2="220" />
          <line x1="270" y1="0" x2="270" y2="220" />
          <line x1="340" y1="0" x2="340" y2="220" />
        </g>

        {/* Main roads — bolder */}
        <g stroke="#ABBFCE" strokeWidth="2" opacity="0.6">
          <line x1="0" y1="110" x2="400" y2="110" />
          <line x1="200" y1="0" x2="200" y2="220" />
          {/* Diagonal */}
          <line x1="40" y1="180" x2="360" y2="50" />
        </g>

        {/* Delivery route — dashed */}
        <path
          d="M 80 170 C 120 130, 160 90, 200 100 S 280 80, 320 60"
          stroke="#59788E"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          fill="none"
          opacity="0.8"
        />

        {/* Route dots */}
        <circle cx="80" cy="170" r="3" fill="#59788E" opacity="0.6" />
        <circle cx="200" cy="100" r="3" fill="#59788E" opacity="0.6" />
        <circle cx="320" cy="60" r="3" fill="#59788E" opacity="0.6" />

        {/* Pickup marker */}
        <g transform="translate(80, 150)">
          <circle cx="0" cy="0" r="10" fill="#D99F16" opacity="0.2" />
          <circle cx="0" cy="0" r="6" fill="#D99F16" />
          <circle cx="0" cy="0" r="3" fill="white" />
        </g>

        {/* Delivery marker */}
        <g transform="translate(320, 40)">
          <circle cx="0" cy="0" r="10" fill="#59788E" opacity="0.2" />
          <circle cx="0" cy="0" r="6" fill="#59788E" />
          <circle cx="0" cy="0" r="3" fill="white" />
        </g>

        {/* Building blocks — abstract neighborhood */}
        <g fill="#C7D4DF" opacity="0.3">
          <rect x="135" y="42" width="20" height="14" rx="2" />
          <rect x="162" y="42" width="12" height="14" rx="2" />
          <rect x="210" y="122" width="18" height="16" rx="2" />
          <rect x="235" y="122" width="24" height="16" rx="2" />
          <rect x="68" y="82" width="16" height="12" rx="2" />
          <rect x="90" y="82" width="20" height="12" rx="2" />
          <rect x="280" y="162" width="22" height="14" rx="2" />
          <rect x="308" y="162" width="14" height="14" rx="2" />
        </g>
      </svg>

      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Status pill overlay — top right */}
      {status && (
        <div className="absolute right-3 top-3">
          <StatusBadge status={status} />
        </div>
      )}
    </div>
  )
}
