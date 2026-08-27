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
 * A shared loading transition screen featuring an idling danfo bus.
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
      {/* Danfo illustration with idle bob */}
      <div
        style={{ animation: 'danfo-idle 1.2s ease-in-out infinite' }}
      >
        <svg
          width="180"
          height="120"
          viewBox="0 0 240 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* ── Ground shadow ── */}
          <ellipse cx="130" cy="138" rx="80" ry="6" fill="#1E1C1A" opacity="0.08" />

          {/* ── Bus body ── */}
          {/* Main body shape — rounded top like the VW-style danfo */}
          <path
            d="M40 68C40 48 50 36 68 36H192C208 36 218 48 218 68V118C218 124 214 128 208 128H52C46 128 40 124 40 118V68Z"
            fill="#D99F16"
          />

          {/* Roof highlight — slightly lighter yellow strip across the top */}
          <path
            d="M50 50C50 42 58 36 68 36H192C202 36 210 42 210 50V52H50V50Z"
            fill="#E9B855"
          />

          {/* ── Black stripes (the signature danfo lines) ── */}
          <rect x="40" y="92" width="178" height="7" rx="1" fill="#1E1C1A" />
          <rect x="40" y="103" width="178" height="4" rx="1" fill="#1E1C1A" />

          {/* ── Rear panel ── */}
          <path d="M40 70H46V128H40V70Z" fill="#B88510" />
          {/* Tail light */}
          <rect x="40" y="110" width="6" height="10" rx="1" fill="#C0392B" />

          {/* ── Windows (teal, like the reference) ── */}
          {/* Window 1 */}
          <rect x="60" y="48" width="28" height="30" rx="3" fill="#59788E" />
          {/* Window 2 */}
          <rect x="94" y="48" width="28" height="30" rx="3" fill="#59788E" />
          {/* Window 3 */}
          <rect x="128" y="48" width="28" height="30" rx="3" fill="#59788E" />

          {/* Window reflections */}
          <line x1="68" y1="50" x2="64" y2="72" stroke="#FCFAEE" strokeWidth="2" opacity="0.25" />
          <line x1="102" y1="50" x2="98" y2="72" stroke="#FCFAEE" strokeWidth="2" opacity="0.25" />
          <line x1="136" y1="50" x2="132" y2="72" stroke="#FCFAEE" strokeWidth="2" opacity="0.25" />

          {/* ── Front windshield ── */}
          <path
            d="M162 48H204C210 48 215 52 216 58L218 76C218 78 216 80 214 80H162V48Z"
            fill="#59788E"
          />
          <line x1="172" y1="50" x2="167" y2="76" stroke="#FCFAEE" strokeWidth="2" opacity="0.25" />

          {/* ── Front bumper / grill area ── */}
          <path
            d="M212 90H222C224 90 226 92 226 94V120C226 124 222 128 218 128H212V90Z"
            fill="#1E1C1A"
          />
          {/* Headlight */}
          <rect x="218" y="94" width="6" height="8" rx="2" fill="#FCFAEE" />

          {/* ── Rear vents (horizontal lines on the back) ── */}
          <line x1="46" y1="56" x2="54" y2="56" stroke="#1E1C1A" strokeWidth="2" />
          <line x1="46" y1="60" x2="54" y2="60" stroke="#1E1C1A" strokeWidth="2" />
          <line x1="46" y1="64" x2="54" y2="64" stroke="#1E1C1A" strokeWidth="2" />
          <line x1="46" y1="68" x2="54" y2="68" stroke="#1E1C1A" strokeWidth="2" />

          {/* ── Front grill lines ── */}
          <line x1="218" y1="108" x2="224" y2="108" stroke="#3F3937" strokeWidth="1.5" />
          <line x1="218" y1="112" x2="224" y2="112" stroke="#3F3937" strokeWidth="1.5" />
          <line x1="218" y1="116" x2="224" y2="116" stroke="#3F3937" strokeWidth="1.5" />

          {/* ── Wheels ── */}
          {/* Rear wheel */}
          <circle cx="80" cy="128" r="14" fill="#1E1C1A" />
          <circle cx="80" cy="128" r="8" fill="#3F3937" />
          <circle cx="80" cy="128" r="4" fill="#FCFAEE" />

          {/* Front wheel */}
          <circle cx="185" cy="128" r="14" fill="#1E1C1A" />
          <circle cx="185" cy="128" r="8" fill="#3F3937" />
          <circle cx="185" cy="128" r="4" fill="#FCFAEE" />

          {/* ── Speed lines (behind the bus) ── */}
          <line x1="10" y1="100" x2="32" y2="100" stroke="#1E1C1A" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
          <line x1="16" y1="110" x2="36" y2="110" stroke="#1E1C1A" strokeWidth="2.5" strokeLinecap="round" opacity="0.15" />
          <line x1="20" y1="120" x2="38" y2="120" stroke="#1E1C1A" strokeWidth="2" strokeLinecap="round" opacity="0.1" />

          {/* ── Ground line ── */}
          <line x1="50" y1="142" x2="220" y2="142" stroke="#1E1C1A" strokeWidth="2.5" strokeLinecap="round" opacity="0.15" />
        </svg>
      </div>

      {/* Loading copy */}
      <p className="mt-6 font-body text-sm font-medium text-ink-500">
        {message}
      </p>
    </div>
  )
}
