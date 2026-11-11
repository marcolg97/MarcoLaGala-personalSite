"use client"

import { Pause, Play, Pointer } from "lucide-react"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

/**
 * Animations start once a figure is well inside the screen, not as soon as it peeks in
 * from the bottom (the reader is usually still reading the text above it).
 * The observed area is the top 80% of the viewport.
 */
export const START_LINE = "0px 0px -20% 0px"

/** True while at least `threshold` of the element is in the top 80% of the screen. */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold, rootMargin: START_LINE }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

/** Becomes true the first time the element reaches the top 80% of the screen, and stays true. */
export function useSeenOnce<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setSeen(true)
        observer.disconnect()
      },
      { threshold, rootMargin: START_LINE }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, seen }
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/** True when the reader asked the system for less motion. */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  )
}

const NARROW = "(max-width: 639px)"

function subscribeNarrow(onChange: () => void) {
  const query = window.matchMedia(NARROW)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

/** True on phone-width screens: figures switch to a compact layout with bigger text. */
export function useNarrow() {
  return useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia(NARROW).matches,
    () => false
  )
}

/**
 * Steps through `count` states on its own while `active` (usually: the figure is on
 * screen), until the reader picks one. With reduced motion it never starts.
 *
 *   const { ref, inView } = useInView<HTMLElement>()
 *   const autoplay = useAutoplay(3, inView)
 */
export function useAutoplay(
  count: number,
  active: boolean,
  interval = 3500,
  /** Stop on its own after this many changes (by default it never stops). */
  maxSteps = Infinity
) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [steps, setSteps] = useState(0)
  const reducedMotion = useReducedMotion()

  const running = playing && active && !reducedMotion && steps < maxSteps
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % count)
      setSteps((n) => n + 1)
    }, interval)
    return () => clearInterval(id)
  }, [running, count, interval])

  return {
    index,
    running,
    interval,
    /** The reader chose a state: show it and stop the autoplay. */
    pick(i: number) {
      setPlaying(false)
      setIndex(i)
    },
    toggle() {
      setPlaying((p) => !p)
      setSteps(0)
    },
  }
}

/**
 * The row above an interactive figure's buttons: tells readers they can pick a state,
 * and lets them pause or resume the autoplay.
 */
export function AutoplayHint({
  running,
  onToggle,
  children,
}: {
  running: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="mb-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm opacity-80">
      <span className="inline-flex items-center gap-1.5">
        <Pointer className="size-3.5" aria-hidden />
        {children}
      </span>
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 hover:bg-current/10"
      >
        {running ? <Pause className="size-3" aria-hidden /> : <Play className="size-3" aria-hidden />}
        {running ? "Pause" : "Play"}
      </button>
    </div>
  )
}

/** A pill button for the states of an interactive figure, with a progress bar while autoplay runs. */
export function StateButton({
  selected,
  running,
  interval,
  onClick,
  children,
}: {
  selected: boolean
  running: boolean
  interval: number
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className="relative cursor-pointer overflow-hidden rounded-full border border-current/20 px-3.5 py-1 text-sm font-semibold transition-colors hover:bg-current/10 aria-pressed:border-current/40 aria-pressed:bg-current/12"
    >
      {children}
      {selected && running && (
        <span
          key={String(selected)}
          aria-hidden
          className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-current/50"
          style={{ animation: `state-progress ${interval}ms linear` }}
        />
      )}
    </button>
  )
}
