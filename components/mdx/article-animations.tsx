"use client"

import { useEffect } from "react"
import { START_LINE } from "./interactive"

/**
 * Inline SVG animations (SMIL) and the blob thought only play while they're on screen:
 * they start from the beginning when the reader scrolls to them and pause when they
 * scroll away. Rendered once inside `.article`.
 *
 * With reduced motion they don't play: each SVG shows the frame at its
 * `data-reduced-time` (seconds), the one that makes the figure's point.
 */
export function ArticleAnimations() {
  useEffect(() => {
    const root = document.querySelector(".article")
    if (!root) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const svgs = [...root.querySelectorAll("svg")].filter((svg) =>
      svg.querySelector("animate, animateTransform")
    )
    const thoughts = [...root.querySelectorAll<HTMLElement>(".blob-thought")]
    const terms = [...root.querySelectorAll<HTMLElement>(".term")]

    for (const svg of svgs) {
      svg.pauseAnimations()
      if (reduced) svg.setCurrentTime(Number(svg.dataset.reducedTime ?? 0))
    }
    if (reduced) {
      for (const term of terms) term.dataset.seen = ""
      return
    }

    // New terms: the highlighter sweeps in once, the first time they're on screen
    const termObserver = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting || !(target instanceof HTMLElement)) continue
          target.dataset.seen = ""
          termObserver.unobserve(target)
        }
      },
      { threshold: 1, rootMargin: "0px 0px -15% 0px" }
    )
    for (const term of terms) termObserver.observe(term)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (target instanceof SVGSVGElement) {
            if (isIntersecting) {
              target.setCurrentTime(0)
              target.unpauseAnimations()
            } else {
              target.pauseAnimations()
            }
          } else if (target instanceof HTMLElement) {
            // The bubble pops in once and stays; the blob keeps moving only while visible
            if (isIntersecting) target.dataset.inView = ""
            else delete target.dataset.inView
          }
        }
      },
      { threshold: 0.4, rootMargin: START_LINE }
    )
    for (const element of [...svgs, ...thoughts]) observer.observe(element)
    return () => {
      observer.disconnect()
      termObserver.disconnect()
    }
  }, [])

  return null
}
