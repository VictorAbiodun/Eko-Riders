/**
 * Client-side SPA navigation helper.
 * Pushes state to history and dispatches popstate event so App router updates immediately.
 */
export function navigate(to: string) {
  if (window.location.pathname === to) return
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}
