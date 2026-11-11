"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { AutoplayHint, StateButton, useAutoplay, useInView } from "./interactive"

/**
 * The four themes of the design-tokens proof of concept on one phone screen, plus the
 * things a theme makes easy: light or dark, an accent the user picks, a legible font.
 * The themes cycle on their own while on screen, until the reader picks one (never
 * with reduced motion). The other controls never autoplay.
 *
 *   <ThemePlayground />
 */

type Mode = "light" | "dark"

/** One appearance of a theme: where its semantic tokens point. */
type Scheme = {
  page: string
  card: string
  action: string
  ink: string
  sub: string
  up: string
  down: string
  tokens: { action: string; card: string }
}

type Theme = {
  name: string
  light: Scheme
  dark: Scheme
  cornerCard: number
  cornerControl: number
  fontFamily: string
  amountWeight: number
  labelWeight: number
  tokens: { corner: string; type: string }
}

const LIGHT_INK = { ink: "#1C1C1E", sub: "#6E6E73", up: "#1E7A47", down: "#C9302C" }
const DARK_INK = { ink: "#F2F2F7", sub: "#A1A1AA", up: "#4CC38A", down: "#FF6B6B" }

const themes: Theme[] = [
  {
    name: "Classic",
    light: { page: "#FFFFFF", card: "#F2F2F4", action: "#1C1C1E", ...LIGHT_INK, tokens: { action: "gray900", card: "gray100" } },
    dark: { page: "#000000", card: "#1C1C1E", action: "#F2F2F4", ...DARK_INK, tokens: { action: "gray100", card: "gray900" } },
    cornerCard: 12,
    cornerControl: 15,
    fontFamily: "inherit",
    amountWeight: 700,
    labelWeight: 600,
    tokens: { corner: "radius20", type: "fontSystem" },
  },
  {
    name: "Soft",
    light: { page: "#F8F4EE", card: "#EFE6DA", action: "#5E4FC4", ...LIGHT_INK, ink: "#2A2238", down: "#B4234F", tokens: { action: "lilac600", card: "sand100" } },
    dark: { page: "#17141F", card: "#26212F", action: "#B8ADFF", ...DARK_INK, tokens: { action: "lilac300", card: "night900" } },
    cornerCard: 18,
    cornerControl: 15,
    fontFamily: "ui-rounded, 'SF Pro Rounded', inherit",
    amountWeight: 700,
    labelWeight: 600,
    tokens: { corner: "radius28", type: "fontRounded" },
  },
  {
    name: "Monochrome",
    light: { page: "#FFFFFF", card: "#F2F2F4", action: "#1C1C1E", ...LIGHT_INK, up: "#1C1C1E", down: "#1C1C1E", tokens: { action: "gray900", card: "gray100" } },
    dark: { page: "#000000", card: "#1C1C1E", action: "#F2F2F4", ...DARK_INK, up: "#F2F2F7", down: "#F2F2F7", tokens: { action: "gray100", card: "gray900" } },
    cornerCard: 2,
    cornerControl: 2,
    fontFamily: "inherit",
    amountWeight: 300,
    labelWeight: 400,
    tokens: { corner: "radius4", type: "fontLight" },
  },
  {
    name: "Sharp",
    light: { page: "#FFFFFF", card: "#ECEFFB", action: "#1F3FD8", ...LIGHT_INK, tokens: { action: "cobalt600", card: "cobalt100" } },
    dark: { page: "#0E1222", card: "#1A2035", action: "#6F8CFF", ...DARK_INK, tokens: { action: "cobalt400", card: "ink900" } },
    cornerCard: 0,
    cornerControl: 0,
    fontFamily: "'Arial Narrow', 'Roboto Condensed', inherit",
    amountWeight: 900,
    labelWeight: 800,
    tokens: { corner: "radius0", type: "fontCondensedHeavy" },
  },
]

/** Accents the user can pick. `null` keeps the theme's own action color. */
const accents = [
  { name: "Theme", color: null, token: null },
  { name: "Blue", color: "#2E6BF6", token: "blue600" },
  { name: "Teal", color: "#0D6B57", token: "teal700" },
  { name: "Rose", color: "#D6336C", token: "rose600" },
  { name: "Orange", color: "#E8590C", token: "orange600" },
] as const

const projects = [
  { name: "Project Alpha", value: "48 tasks", change: "▲ +12%", up: true },
  { name: "Project Beta", value: "23 tasks", change: "▲ +8%", up: true },
  { name: "Project Gamma", value: "9 tasks", change: "▼ −3%", up: false },
]

const LEGIBLE_FONT = "var(--font-legible), 'Atkinson Hyperlegible', sans-serif"
const smooth = { transition: "fill 0.5s, rx 0.5s, font-weight 0.3s" } as const

/** Text on a filled shape: dark ink on light fills, white on dark ones. */
function onColor(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return lum > 0.6 ? "#1C1C1E" : "#FFFFFF"
}

export function ThemePlayground() {
  const { ref, inView } = useInView<HTMLElement>()
  const autoplay = useAutoplay(themes.length, inView, 3500, 8)
  const [mode, setMode] = useState<Mode>("light")
  const [accentIndex, setAccentIndex] = useState(0)
  const [legible, setLegible] = useState(false)

  const t = themes[autoplay.index]
  const scheme = t[mode]
  const accent = accents[accentIndex]
  const action = accent.color ?? scheme.action
  const actionToken = accent.token ?? scheme.tokens.action
  const onAction = onColor(action)
  const fontFamily = legible ? LEGIBLE_FONT : t.fontFamily
  const X = 22

  const swatch = (color: string) => (
    <span
      className="inline-block size-3.5 rounded-sm align-[-2px] ring-1 ring-current/20 transition-colors duration-500"
      style={{ background: color }}
    />
  )

  return (
    <figure data-figure="theme-playground" ref={ref} className="not-prose">
      <AutoplayHint running={autoplay.running} onToggle={autoplay.toggle}>
        Pick a theme, then try dark mode, an accent and the legible font
      </AutoplayHint>
      <div role="group" aria-label="Theme" className="mb-3 flex flex-wrap justify-center gap-1.5">
        {themes.map((theme, i) => (
          <StateButton
            key={theme.name}
            selected={i === autoplay.index}
            running={autoplay.running}
            interval={autoplay.interval}
            onClick={() => autoplay.pick(i)}
          >
            {theme.name}
          </StateButton>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-sm">
        <div role="group" aria-label="Appearance" className="inline-flex rounded-full border border-current/20 p-0.5">
          {(["light", "dark"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => {
                setMode(m)
                autoplay.pick(autoplay.index)
              }}
              className="rounded-full px-3 py-0.5 font-semibold capitalize transition-colors hover:bg-current/10 aria-pressed:bg-current/12"
            >
              {m}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Accent color" className="inline-flex items-center gap-1.5">
          <span className="mr-0.5 opacity-70">Accent</span>
          {accents.map((a, i) => (
            <button
              key={a.name}
              type="button"
              aria-pressed={accentIndex === i}
              aria-label={a.name === "Theme" ? "Theme color" : a.name}
              title={a.name === "Theme" ? "Theme color" : a.name}
              onClick={() => {
                setAccentIndex(i)
                autoplay.pick(autoplay.index)
              }}
              className={cn(
                "size-6 rounded-full ring-offset-2 ring-offset-background transition aria-pressed:ring-2 aria-pressed:ring-current",
                a.color === null && "border border-dashed border-current/50"
              )}
              style={a.color ? { background: a.color } : undefined}
            />
          ))}
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={legible}
            onChange={(e) => {
              setLegible(e.target.checked)
              autoplay.pick(autoplay.index)
            }}
            className="size-4 accent-current"
          />
          Legible font
        </label>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-10">
        <svg
          viewBox="0 0 260 370"
          className="w-full max-w-[260px]"
          role="img"
          aria-label={`An app screen in the ${t.name} theme, ${mode} mode${accent.color ? `, ${accent.name.toLowerCase()} accent` : ""}${legible ? ", legible font" : ""}`}
        >
          <rect x="1" y="1" width="258" height="368" rx="38" fill={scheme.page} stroke="currentColor" strokeOpacity="0.4" style={smooth} />
          <rect x="100" y="11" width="60" height="16" rx="8" fill={mode === "dark" ? "#2C2C2E" : "#111111"} style={smooth} />
          <g fill={scheme.ink} style={{ fontFamily, transition: "fill 0.5s" }}>
            <text x={X} y="52" fontSize="11" fill={scheme.sub}>Done this week</text>
            <text x={X} y="82" fontSize="27" fontWeight={t.amountWeight} style={smooth}>1,234</text>
            <text x={X} y="100" fontSize="11" fill={scheme.down} style={smooth}>▼ −56 since last week</text>
            {[
              ["Favorites", "12"],
              ["Lists", "3"],
              ["New", null],
            ].map(([label, value], i) => {
              const x = X + i * 74
              return (
                <g key={label}>
                  <rect x={x} y="114" width="68" height="46" rx={t.cornerCard} fill={scheme.card} style={smooth} />
                  <text x={x + 9} y="132" fontSize="10" fill={scheme.sub}>{label}</text>
                  {value ? (
                    <text x={x + 9} y="151" fontSize="11" fontWeight={t.labelWeight}>{value}</text>
                  ) : (
                    <g>
                      <circle cx={x + 15} cy="147" r="6" fill={action} style={smooth} />
                      <path d={`M${x + 12} 147 H ${x + 18} M${x + 15} 144 V 150`} stroke={onAction} strokeWidth="1.5" strokeLinecap="round" />
                    </g>
                  )}
                </g>
              )
            })}
            <text x={X} y="182" fontSize="11" fontWeight={t.labelWeight}>Projects</text>
            <text x={X + 216} y="182" fontSize="10" textAnchor="end" fill={scheme.sub}>This month</text>
            <rect x={X} y="190" width="216" height="120" rx={t.cornerCard} fill={scheme.card} style={smooth} />
            {projects.map((h, i) => {
              const y = 210 + i * 40
              return (
                <g key={h.name}>
                  <text x={X + 10} y={y} fontSize="11" fontWeight={t.labelWeight}>{h.name}</text>
                  <text x={X + 10} y={y + 15} fontSize="10" fill={scheme.sub}>{h.value}</text>
                  <text x={X + 206} y={y} fontSize="11" textAnchor="end" fontWeight={t.labelWeight} fill={h.up ? scheme.up : scheme.down} style={smooth}>
                    {h.change}
                  </text>
                  {i < 2 && <path d={`M${X + 10} ${y + 22} H ${X + 206}`} stroke={scheme.ink} strokeOpacity="0.1" />}
                </g>
              )
            })}
            <rect x={X} y="324" width="92" height="30" rx={t.cornerControl} fill={scheme.card} style={smooth} />
            <text x={X + 10} y="343" fontSize="11">Search</text>
            <rect x={X + 98} y="324" width="118" height="30" rx={t.cornerControl} fill={action} style={smooth} />
            <text x={X + 108} y="343" fontSize="11" fill={onAction} fontWeight={t.labelWeight}>Create</text>
            <text x={X + 204} y="343" fontSize="12" textAnchor="end" fill={onAction}>+</text>
          </g>
        </svg>

        <div className="w-full max-w-[22rem] sm:max-w-[16rem]">
          <p className="mb-3 text-xs font-semibold tracking-wide uppercase opacity-60">Semantic tokens</p>
          <dl aria-live="polite" className="grid grid-cols-2 gap-x-4 gap-y-3 font-mono text-sm sm:grid-cols-1">
            {[
              ["actionPrimary", actionToken, action],
              ["surfaceCard", scheme.tokens.card, scheme.card],
              ["cornerCard", t.tokens.corner, null],
              ["fontBody", legible ? "fontLegible" : t.tokens.type, null],
            ].map(([token, value, color]) => (
              <div key={token}>
                <dt>{token}</dt>
                <dd className="m-0 opacity-70">
                  {color && swatch(color)} → {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <figcaption>
        The four themes of the proof of concept, in light and dark, with an accent and a legible font on top. Same screen, same components: only the semantic tokens next to the screen change.
      </figcaption>
    </figure>
  )
}
