/**
 * Custom events for the blog: read depth, link clicks, interactions with figures.
 *
 * They go to Umami (cookieless, no personal data), loaded in the layout; it only counts
 * visits on marcolagala.com (`data-domains`), so local development sends nothing. Vercel Web Analytics keeps counting page views,
 * visitors, referrers, countries and devices, but on the Hobby plan it doesn't accept
 * custom events. In development, events are also logged in the console.
 */

type EventData = Record<string, string | number>

declare global {
  interface Window {
    umami?: { track: (name: string, data?: EventData) => void }
  }
}

export function trackEvent(name: string, data?: EventData) {
  if (typeof window === "undefined") return
  if (process.env.NODE_ENV === "development") console.debug("[track]", name, data ?? {})
  window.umami?.track(name, data)
}
