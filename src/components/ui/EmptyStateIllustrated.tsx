

interface EmptyStateIllustratedProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyStateIllustrated({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateIllustratedProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-brand-50 relative">
        {/* Background decorative elements */}
        <div className="absolute right-4 top-6 h-3 w-3 rounded-full bg-accent-200" />
        <div className="absolute bottom-6 left-4 h-4 w-4 rounded-sm bg-brand-200 rotate-12" />
        <div className="absolute top-1/2 -left-2 h-1.5 w-1.5 rounded-full bg-ink-200" />

        {/* Geometric Danfo Illustration */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Shadow */}
          <ellipse cx="60" cy="98" rx="45" ry="4" fill="#1E1C1A" opacity="0.1" />

          {/* Bus Body Base */}
          <path
            d="M20 50C20 40 25 35 35 35H95C102 35 106 40 106 50V85C106 90 102 92 95 92H35C25 92 20 90 20 85V50Z"
            fill="#D99F16"
          />
          
          {/* Black Stripes */}
          <rect x="20" y="65" width="86" height="6" fill="#1E1C1A" />
          <rect x="20" y="74" width="86" height="3" fill="#1E1C1A" />

          {/* Front Bumper / Grill area */}
          <path d="M100 65H108V92C108 94 104 95 100 95V65Z" fill="#1E1C1A" />
          
          {/* Windows */}
          <rect x="30" y="42" width="16" height="15" rx="2" fill="#59788E" />
          <rect x="50" y="42" width="16" height="15" rx="2" fill="#59788E" />
          <rect x="70" y="42" width="16" height="15" rx="2" fill="#59788E" />
          
          {/* Front Windshield */}
          <path d="M90 42H103C104 42 105 43 105 44.5L106 55C106 56 105 57 103 57H90V42Z" fill="#59788E" />

          {/* Wheels */}
          <circle cx="40" cy="92" r="8" fill="#1E1C1A" />
          <circle cx="40" cy="92" r="3" fill="#FCFAEE" />
          
          <circle cx="85" cy="92" r="8" fill="#1E1C1A" />
          <circle cx="85" cy="92" r="3" fill="#FCFAEE" />

          {/* Abstract Route Line below */}
          <path
            d="M30 105 L50 105 L60 110 L90 110"
            stroke="#59788E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 6"
          />
          <circle cx="90" cy="110" r="4" fill="#D99F16" stroke="#1E1C1A" strokeWidth="2" />
        </svg>
      </div>

      <h3 className="font-heading text-xl font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-neutral-500">{description}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 rounded-xl bg-ink px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
