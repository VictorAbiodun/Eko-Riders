import { useEffect, useRef, useState } from 'react'
import { DanfoLoader } from '../components/ui/DanfoLoader'

/**
 * Short danfo transition whenever a tab/route key changes inside an app shell.
 */
export function useDanfoTransition(routeKey: string, durationMs = 450) {
  const [loading, setLoading] = useState(false)
  const prev = useRef(routeKey)

  useEffect(() => {
    if (prev.current === routeKey) return
    prev.current = routeKey
    setLoading(true)
  }, [routeKey])

  const overlay = loading ? (
    <DanfoLoader durationMs={durationMs} onFinish={() => setLoading(false)} />
  ) : null

  return overlay
}
