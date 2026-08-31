import { useState, useEffect } from 'react'

interface DanfoLoaderProps {
  /** Message shown below the illustration */
  message?: string
  /** Duration of the simulated loading delay in ms (default 750) */
  durationMs?: number
  /** Called when the loader finishes and fades out */
  onFinish?: () => void
}

/**
 * A shared loading transition screen featuring an okada delivery bike
 * in danfo livery — mustard yellow body with charcoal stripe accents.
 *
 * Usage:
 * ```tsx
 * const [loading, setLoading] = useState(true)
 * if (loading) return <DanfoLoader onFinish={() => setLoading(false)} />
 * ```
 */
export function DanfoLoader({
  message = 'Getting your delivery ready\u2026',
  durationMs = 750,
  onFinish,
}: DanfoLoaderProps) {
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    const holdTimer = setTimeout(() => {
      setFadingOut(true)
    }, durationMs)

    return () => clearTimeout(holdTimer)
  }, [durationMs])

  useEffect(() => {
    if (!fadingOut) return
    const exitTimer = setTimeout(() => {
      onFinish?.()
    }, 280) // matches the fade-out animation duration
    return () => clearTimeout(exitTimer)
  }, [fadingOut, onFinish])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-50"
      style={{
        animation: fadingOut ? 'loader-fade-out 280ms ease-out forwards' : undefined,
      }}
    >
      {/* Okada delivery bike with gentle suspension bob */}
      <div
        style={{ animation: 'okada-bob 0.8s ease-in-out infinite' }}
      >
        <svg
          width="180"
          height="130"
          viewBox="0 0 280 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* ── Ground shadow ── */}
          <ellipse cx="150" cy="160" rx="90" ry="5" fill="#1E1C1A" opacity="0.07" />

          {/* ── Rear wheel ── */}
          <circle cx="80" cy="138" r="22" fill="#1E1C1A" />
          <circle cx="80" cy="138" r="16" fill="#3F3937" />
          <circle cx="80" cy="138" r="10" fill="#1E1C1A" />
          <circle cx="80" cy="138" r="4" fill="#FCFAEE" />
          {/* Spokes hint */}
          <line x1="80" y1="122" x2="80" y2="128" stroke="#5D5753" strokeWidth="1.5" />
          <line x1="66" y1="132" x2="71" y2="135" stroke="#5D5753" strokeWidth="1.5" />
          <line x1="94" y1="132" x2="89" y2="135" stroke="#5D5753" strokeWidth="1.5" />
          <line x1="72" y1="150" x2="76" y2="146" stroke="#5D5753" strokeWidth="1.5" />
          <line x1="88" y1="150" x2="84" y2="146" stroke="#5D5753" strokeWidth="1.5" />

          {/* ── Front wheel ── */}
          <circle cx="210" cy="138" r="22" fill="#1E1C1A" />
          <circle cx="210" cy="138" r="16" fill="#3F3937" />
          <circle cx="210" cy="138" r="10" fill="#1E1C1A" />
          <circle cx="210" cy="138" r="4" fill="#FCFAEE" />
          {/* Spokes hint */}
          <line x1="210" y1="122" x2="210" y2="128" stroke="#5D5753" strokeWidth="1.5" />
          <line x1="196" y1="132" x2="201" y2="135" stroke="#5D5753" strokeWidth="1.5" />
          <line x1="224" y1="132" x2="219" y2="135" stroke="#5D5753" strokeWidth="1.5" />
          <line x1="202" y1="150" x2="206" y2="146" stroke="#5D5753" strokeWidth="1.5" />
          <line x1="218" y1="150" x2="214" y2="146" stroke="#5D5753" strokeWidth="1.5" />

          {/* ── Chain / lower frame ── */}
          <line x1="80" y1="138" x2="145" y2="120" stroke="#1E1C1A" strokeWidth="3" strokeLinecap="round" />

          {/* ── Rear swingarm ── */}
          <line x1="80" y1="138" x2="140" y2="110" stroke="#3F3937" strokeWidth="4" strokeLinecap="round" />

          {/* ── Frame backbone ── */}
          <path
            d="M140 110L155 70L200 90L210 138"
            stroke="#1E1C1A"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Down tube */}
          <line x1="140" y1="110" x2="145" y2="126" stroke="#1E1C1A" strokeWidth="3.5" strokeLinecap="round" />

          {/* ── Engine block (simplified rectangle) ── */}
          <rect x="125" y="108" width="30" height="20" rx="4" fill="#3F3937" />
          <rect x="128" y="111" width="8" height="6" rx="1" fill="#1E1C1A" />
          {/* Exhaust pipe */}
          <path
            d="M80 135L100 130L120 125"
            stroke="#5D5753"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* ── Fuel tank — mustard yellow with charcoal stripe ── */}
          <path
            d="M140 80C140 74 144 70 150 68L175 64C180 63 185 66 185 72V86C185 90 181 93 177 93H148C143 93 140 89 140 85V80Z"
            fill="#D99F16"
          />
          {/* Danfo stripe on tank */}
          <rect x="142" y="79" width="41" height="5" rx="1" fill="#1E1C1A" />
          {/* Second thinner stripe */}
          <rect x="142" y="87" width="41" height="3" rx="1" fill="#1E1C1A" />
          {/* Tank highlight */}
          <path
            d="M152 70L156 69V76L152 77V70Z"
            fill="#E9B855"
            opacity="0.6"
          />

          {/* ── Fairing / side panel — mustard yellow ── */}
          <path
            d="M155 93H177C179 93 180 95 180 97V108C180 110 178 112 176 112H150C148 112 146 110 147 108L150 95C150 94 152 93 155 93Z"
            fill="#D99F16"
          />
          {/* Fairing stripe */}
          <rect x="149" y="100" width="30" height="4" rx="1" fill="#1E1C1A" />

          {/* ── Seat ── */}
          <path
            d="M120 72C120 68 124 65 128 65H150C154 65 158 68 158 72V75C158 78 155 80 152 80H124C121 80 120 78 120 75V72Z"
            fill="#1E1C1A"
          />
          {/* Seat cushion top */}
          <rect x="123" y="66" width="32" height="4" rx="2" fill="#3F3937" />

          {/* ── Front fork ── */}
          <line x1="200" y1="90" x2="210" y2="138" stroke="#5D5753" strokeWidth="4" strokeLinecap="round" />
          <line x1="195" y1="90" x2="206" y2="138" stroke="#5D5753" strokeWidth="3" strokeLinecap="round" />

          {/* ── Handlebars ── */}
          <line x1="185" y1="64" x2="205" y2="60" stroke="#1E1C1A" strokeWidth="3.5" strokeLinecap="round" />
          {/* Left grip */}
          <rect x="180" y="61" width="8" height="6" rx="3" fill="#3F3937" />
          {/* Right grip */}
          <rect x="203" y="57" width="8" height="6" rx="3" fill="#3F3937" />
          {/* Mirror (left) */}
          <circle cx="182" cy="59" r="3.5" fill="#1E1C1A" />
          <circle cx="182" cy="59" r="2" fill="#59788E" />

          {/* ── Headlight ── */}
          <circle cx="215" cy="86" r="7" fill="#1E1C1A" />
          <circle cx="215" cy="86" r="5" fill="#FCFAEE" />
          {/* Teal accent reflection */}
          <circle cx="216" cy="85" r="2.5" fill="#59788E" opacity="0.4" />

          {/* ── Rear mudguard ── */}
          <path
            d="M60 128C60 120 68 116 80 116C92 116 96 120 96 124"
            stroke="#1E1C1A"
            strokeWidth="3"
            fill="none"
          />

          {/* ── Front mudguard ── */}
          <path
            d="M194 128C194 120 200 116 210 116C220 116 226 120 226 124"
            stroke="#1E1C1A"
            strokeWidth="3"
            fill="none"
          />

          {/* ── Tail light ── */}
          <rect x="110" y="76" width="6" height="4" rx="2" fill="#C0392B" />

          {/* ── Delivery box on the back — mustard with charcoal edge ── */}
          <rect x="88" y="52" width="32" height="24" rx="3" fill="#D99F16" />
          {/* Box charcoal stripe */}
          <rect x="88" y="62" width="32" height="4" rx="1" fill="#1E1C1A" />
          {/* Box latch */}
          <rect x="101" y="54" width="6" height="3" rx="1" fill="#1E1C1A" />
          {/* Box side highlight */}
          <rect x="91" y="55" width="3" height="6" rx="1" fill="#E9B855" opacity="0.5" />

          {/* ── Rack / carrier under the box ── */}
          <line x1="90" y1="76" x2="118" y2="76" stroke="#3F3937" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="92" y1="76" x2="95" y2="80" stroke="#3F3937" strokeWidth="2" strokeLinecap="round" />
          <line x1="116" y1="76" x2="113" y2="80" stroke="#3F3937" strokeWidth="2" strokeLinecap="round" />

          {/* ── Speed lines (behind the bike, subtle) ── */}
          <line x1="20" y1="108" x2="46" y2="108" stroke="#1E1C1A" strokeWidth="2.5" strokeLinecap="round" opacity="0.15" />
          <line x1="28" y1="118" x2="50" y2="118" stroke="#1E1C1A" strokeWidth="2" strokeLinecap="round" opacity="0.10" />
          <line x1="34" y1="128" x2="52" y2="128" stroke="#1E1C1A" strokeWidth="1.5" strokeLinecap="round" opacity="0.07" />

          {/* ── Ground line ── */}
          <line x1="50" y1="160" x2="250" y2="160" stroke="#1E1C1A" strokeWidth="2" strokeLinecap="round" opacity="0.12" />
        </svg>
      </div>

      {/* Loading copy */}
      <p className="mt-6 font-body text-sm font-medium text-ink-500">
        {message}
      </p>
    </div>
  )
}
