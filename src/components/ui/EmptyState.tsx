import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
  actionLabel?: string
  onAction?: () => void
  /** Kept for API compatibility — illustration is always the danfo. */
  icon?: unknown
}

export function EmptyState({
  title,
  description,
  action,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-brand-50">
        <div className="absolute top-6 right-4 h-3 w-3 rounded-full bg-accent-200" />
        <div className="absolute bottom-6 left-4 h-4 w-4 rotate-12 rounded-sm bg-brand-200" />
        <div className="absolute top-1/2 -left-2 h-1.5 w-1.5 rounded-full bg-ink-200" />

        {/* Okada delivery bike — matches the shared DanfoLoader illustration */}
        <svg
          width="120"
          height="100"
          viewBox="0 0 280 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
          aria-hidden="true"
        >
          {/* Ground shadow */}
          <ellipse
            cx="150"
            cy="160"
            rx="90"
            ry="5"
            fill="#1E1C1A"
            opacity="0.07"
          />

          {/* Rear wheel */}
          <circle cx="80" cy="138" r="22" fill="#1E1C1A" />
          <circle cx="80" cy="138" r="16" fill="#3F3937" />
          <circle cx="80" cy="138" r="10" fill="#1E1C1A" />
          <circle cx="80" cy="138" r="4" fill="#FCFAEE" />
          <line
            x1="80"
            y1="122"
            x2="80"
            y2="128"
            stroke="#5D5753"
            strokeWidth="1.5"
          />
          <line
            x1="66"
            y1="132"
            x2="71"
            y2="135"
            stroke="#5D5753"
            strokeWidth="1.5"
          />
          <line
            x1="94"
            y1="132"
            x2="89"
            y2="135"
            stroke="#5D5753"
            strokeWidth="1.5"
          />

          {/* Front wheel */}
          <circle cx="210" cy="138" r="22" fill="#1E1C1A" />
          <circle cx="210" cy="138" r="16" fill="#3F3937" />
          <circle cx="210" cy="138" r="10" fill="#1E1C1A" />
          <circle cx="210" cy="138" r="4" fill="#FCFAEE" />
          <line
            x1="210"
            y1="122"
            x2="210"
            y2="128"
            stroke="#5D5753"
            strokeWidth="1.5"
          />
          <line
            x1="196"
            y1="132"
            x2="201"
            y2="135"
            stroke="#5D5753"
            strokeWidth="1.5"
          />
          <line
            x1="224"
            y1="132"
            x2="219"
            y2="135"
            stroke="#5D5753"
            strokeWidth="1.5"
          />

          {/* Chain + swingarm */}
          <line
            x1="80"
            y1="138"
            x2="145"
            y2="120"
            stroke="#1E1C1A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="80"
            y1="138"
            x2="140"
            y2="110"
            stroke="#3F3937"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Frame */}
          <path
            d="M140 110L155 70L200 90L210 138"
            stroke="#1E1C1A"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <line
            x1="140"
            y1="110"
            x2="145"
            y2="126"
            stroke="#1E1C1A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Engine */}
          <rect x="125" y="108" width="30" height="20" rx="4" fill="#3F3937" />
          <rect x="128" y="111" width="8" height="6" rx="1" fill="#1E1C1A" />

          {/* Exhaust */}
          <path
            d="M80 135L100 130L120 125"
            stroke="#5D5753"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Fuel tank — mustard with danfo stripes */}
          <path
            d="M140 80C140 74 144 70 150 68L175 64C180 63 185 66 185 72V86C185 90 181 93 177 93H148C143 93 140 89 140 85V80Z"
            fill="#D99F16"
          />
          <rect x="142" y="79" width="41" height="5" rx="1" fill="#1E1C1A" />
          <rect x="142" y="87" width="41" height="3" rx="1" fill="#1E1C1A" />

          {/* Fairing — mustard with stripe */}
          <path
            d="M155 93H177C179 93 180 95 180 97V108C180 110 178 112 176 112H150C148 112 146 110 147 108L150 95C150 94 152 93 155 93Z"
            fill="#D99F16"
          />
          <rect x="149" y="100" width="30" height="4" rx="1" fill="#1E1C1A" />

          {/* Seat */}
          <path
            d="M120 72C120 68 124 65 128 65H150C154 65 158 68 158 72V75C158 78 155 80 152 80H124C121 80 120 78 120 75V72Z"
            fill="#1E1C1A"
          />
          <rect x="123" y="66" width="32" height="4" rx="2" fill="#3F3937" />

          {/* Front fork */}
          <line
            x1="200"
            y1="90"
            x2="210"
            y2="138"
            stroke="#5D5753"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="195"
            y1="90"
            x2="206"
            y2="138"
            stroke="#5D5753"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Handlebars */}
          <line
            x1="185"
            y1="64"
            x2="205"
            y2="60"
            stroke="#1E1C1A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <rect x="180" y="61" width="8" height="6" rx="3" fill="#3F3937" />
          <rect x="203" y="57" width="8" height="6" rx="3" fill="#3F3937" />
          <circle cx="182" cy="59" r="3.5" fill="#1E1C1A" />
          <circle cx="182" cy="59" r="2" fill="#59788E" />

          {/* Headlight */}
          <circle cx="215" cy="86" r="7" fill="#1E1C1A" />
          <circle cx="215" cy="86" r="5" fill="#FCFAEE" />
          <circle cx="216" cy="85" r="2.5" fill="#59788E" opacity="0.4" />

          {/* Mudguards */}
          <path
            d="M60 128C60 120 68 116 80 116C92 116 96 120 96 124"
            stroke="#1E1C1A"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M194 128C194 120 200 116 210 116C220 116 226 120 226 124"
            stroke="#1E1C1A"
            strokeWidth="3"
            fill="none"
          />

          {/* Tail light */}
          <rect x="110" y="76" width="6" height="4" rx="2" fill="#C0392B" />

          {/* Delivery box on rear rack */}
          <rect x="88" y="52" width="32" height="24" rx="3" fill="#D99F16" />
          <rect x="88" y="62" width="32" height="4" rx="1" fill="#1E1C1A" />
          <rect x="101" y="54" width="6" height="3" rx="1" fill="#1E1C1A" />

          {/* Rack */}
          <line
            x1="90"
            y1="76"
            x2="118"
            y2="76"
            stroke="#3F3937"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Ground line */}
          <line
            x1="50"
            y1="160"
            x2="250"
            y2="160"
            stroke="#1E1C1A"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.12"
          />
        </svg>
      </div>

      <h3 className="font-heading text-lg font-semibold text-ink">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-neutral-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 min-h-touch rounded-xl bg-ink px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
