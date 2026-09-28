"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import type { Heading } from "@/lib/mdx"

// Headings scroll to 6rem from the top (scroll-margin-top in globals.css): a heading
// counts as reached once it is at or above that line, plus a few pixels of tolerance
const REACHED_OFFSET = 96 + 8
// A clicked heading stays active until the user scrolls at least this far
const PIN_TOLERANCE = 40

function useActiveHeading(headings: Heading[]) {
  const [active, setActive] = useState<string | null>(null)
  // After a click the chosen heading stays active: during the jump it causes (y: null),
  // then until the user scrolls away from where the jump landed
  const pinned = useRef<{ y: number | null } | null>(null)

  useEffect(() => {
    const elements = headings
      .map(({ slug }) => document.getElementById(slug))
      .filter((el): el is HTMLElement => el !== null)

    function update() {
      if (elements.length === 0) return
      if (pinned.current) {
        const { y } = pinned.current
        if (y === null || Math.abs(window.scrollY - y) < PIN_TOLERANCE) return
        pinned.current = null
      }

      // Near the end of the page the last headings can't reach the top: during the
      // last screen of scrolling the line slides down to the bottom of the viewport,
      // so every remaining heading still becomes active in order
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      const endProgress = Math.min(
        1,
        Math.max(
          0,
          (window.scrollY - (maxScroll - window.innerHeight)) /
            window.innerHeight
        )
      )
      const line =
        REACHED_OFFSET + (window.innerHeight - REACHED_OFFSET) * endProgress

      let current: string | null = null
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= line) current = el.id
      }
      setActive(current)
    }

    function onScrollEnd() {
      if (pinned.current?.y === null) pinned.current.y = window.scrollY
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("scrollend", onScrollEnd)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("scrollend", onScrollEnd)
    }
  }, [headings])

  function select(slug: string) {
    pinned.current = { y: null }
    setActive(slug)
    // Fallback if no scroll happens (heading already in place) or scrollend is unsupported
    setTimeout(() => {
      if (pinned.current?.y === null) pinned.current.y = window.scrollY
    }, 1000)
  }

  return [active, select] as const
}

export function TOC({ headings }: { headings: Heading[] }) {
  const t = useTranslations("common")
  const [active, select] = useActiveHeading(headings)

  return (
    <nav aria-label={t("tableOfContents")} className="sticky top-24">
      <p className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        {t("tableOfContents")}
      </p>
      <ul className="flex flex-col gap-2 border-l text-sm">
        {headings.map((heading) => (
          <li key={heading.slug}>
            <a
              href={`#${heading.slug}`}
              onClick={() => select(heading.slug)}
              aria-current={active === heading.slug ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 border-transparent py-0.5 pl-4 text-muted-foreground transition-colors hover:text-foreground",
                heading.level === 3 && "pl-7",
                active === heading.slug &&
                  "border-primary font-medium text-foreground"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Collapsible table of contents for small screens, where the sidebar is hidden. */
export function MobileTOC({ headings }: { headings: Heading[] }) {
  const t = useTranslations("common")
  const ref = useRef<HTMLDetailsElement>(null)

  return (
    <details
      ref={ref}
      className="group mb-10 rounded-lg border px-4 py-3 lg:hidden"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium [&::-webkit-details-marker]:hidden">
        {t("tableOfContents")}
        <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <nav aria-label={t("tableOfContents")}>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {headings.map((heading) => (
            <li key={heading.slug}>
              <a
                href={`#${heading.slug}`}
                onClick={() => ref.current?.removeAttribute("open")}
                className={cn(
                  "block py-1 text-muted-foreground hover:text-foreground",
                  heading.level === 3 && "pl-4"
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  )
}
