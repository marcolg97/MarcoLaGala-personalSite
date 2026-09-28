import Image from "next/image"
import type { App } from "@/content"
import { cn } from "@/lib/utils"

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Renders text with every mention of an app ("TheFork", "isybank", ...) as a small
 * chip with its icon, linking to the App Store. Matching is case-insensitive.
 */
export function WithAppMentions({ text, apps }: { text: string; apps: App[] }) {
  if (apps.length === 0) return text

  // Longest names first, so "Intesa Sanpaolo Assicurazioni" wins over shorter overlaps
  const names = apps.map((app) => app.name).sort((a, b) => b.length - a.length)
  // Whole words only: "hOn" must not match inside "iPhone"
  const pattern = new RegExp(
    `(?<![\\p{L}\\d])(${names.map(escapeRegExp).join("|")})(?![\\p{L}\\d])`,
    "giu"
  )
  const byName = new Map(apps.map((app) => [app.name.toLowerCase(), app]))

  const parts = text.split(pattern)
  const nodes: React.ReactNode[] = []

  for (let i = 0; i < parts.length; i++) {
    const app = byName.get(parts[i].toLowerCase())
    if (!app) {
      nodes.push(parts[i])
      continue
    }
    // Keep punctuation right after a chip on the same line: "isybank," never wraps before ","
    const punctuation = parts[i + 1]?.match(/^[,.;:!?)]+/)?.[0] ?? ""
    if (punctuation) parts[i + 1] = parts[i + 1].slice(punctuation.length)

    nodes.push(
      <span key={i} className="whitespace-nowrap">
        <AppMention app={app} beforePunctuation={Boolean(punctuation)} />
        {punctuation}
      </span>
    )
  }

  return nodes
}

function AppMention({
  app,
  beforePunctuation,
}: {
  app: App
  /** No right margin, so "isybank," doesn't read as "isybank ," */
  beforePunctuation: boolean
}) {
  return (
    <a
      href={app.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "ml-0.5 inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-px align-baseline font-medium whitespace-nowrap text-foreground ring-1 ring-border transition-colors hover:bg-accent",
        !beforePunctuation && "mr-0.5"
      )}
    >
      <Image
        src={app.icon}
        alt=""
        width={14}
        height={14}
        className="size-3.5 translate-y-px rounded-[22%]"
      />
      {app.name}
    </a>
  )
}
