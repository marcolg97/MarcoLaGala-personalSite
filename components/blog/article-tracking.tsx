"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

/**
 * Tracks how a post is read, without touching the article components:
 * - read_depth: 25, 50, 75 and 100% of the article scrolled past (once each);
 * - link_click: footnotes, external links, the table of contents, the series card;
 * - figure_interaction: buttons, switches and handles inside a `[data-figure]` element.
 * Exercises report their own completion (`exercise_completed` in <TokenPointer>).
 */
export function ArticleTracking({ slug }: { slug: string }) {
  useEffect(() => {
    const article = document.querySelector<HTMLElement>("article")
    if (!article) return

    // Read depth
    const reached = new Set<number>()
    function onScroll() {
      const rect = article!.getBoundingClientRect()
      const seen = (window.innerHeight - rect.top) / rect.height
      for (const step of [25, 50, 75, 100]) {
        if (seen * 100 >= step && !reached.has(step)) {
          reached.add(step)
          trackEvent("read_depth", { post: slug, percent: step })
        }
      }
      if (reached.size === 4) window.removeEventListener("scroll", onScroll)
    }

    // Links
    function onClick(event: MouseEvent) {
      const target = event.target as Element | null
      const link = target?.closest("a[href]")
      if (link) {
        const href = link.getAttribute("href") ?? ""
        const kind = href.startsWith("#user-content-fn")
          ? "footnote"
          : link.closest("nav, aside") && href.startsWith("#")
            ? "toc"
            : link.closest("[id^='series-']")
              ? "series"
              : /^https?:/.test(href) && !href.includes(window.location.host)
                ? "external"
                : null
        if (kind) trackEvent("link_click", { post: slug, kind, href: kind === "external" ? href.replace(/^https?:\/\//, "").slice(0, 120) : href.slice(0, 80) })
        return
      }
      const control = target?.closest("button, [role='switch'], input")
      const figure = control?.closest("[data-figure]")
      if (control && figure) {
        const label =
          control.getAttribute("aria-label") ||
          control.textContent?.trim() ||
          (control as HTMLInputElement).type ||
          "control"
        trackEvent("figure_interaction", { post: slug, figure: figure.getAttribute("data-figure")!, action: label.slice(0, 40) })
      }
    }

    // Drag handles start with a pointer press, not a click
    function onPointerDown(event: PointerEvent) {
      const handle = (event.target as Element | null)?.closest("[role='slider']")
      const figure = handle?.closest("[data-figure]")
      if (handle && figure) {
        trackEvent("figure_interaction", { post: slug, figure: figure.getAttribute("data-figure")!, action: "drag" })
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("click", onClick)
    document.addEventListener("pointerdown", onPointerDown)
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("click", onClick)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [slug])

  return null
}
