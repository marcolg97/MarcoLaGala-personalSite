const styles = {
  long: { year: "numeric", month: "long", day: "numeric" },
  short: { year: "numeric", month: "short" },
} satisfies Record<string, Intl.DateTimeFormatOptions>

/** Formats an ISO date for display, e.g. "29 settembre 2026" or "Sep 2026". */
export function formatDate(
  iso: string,
  locale: string,
  style: keyof typeof styles = "long"
) {
  return new Date(iso).toLocaleDateString(locale, {
    ...styles[style],
    timeZone: "UTC",
  })
}
