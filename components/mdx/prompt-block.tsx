"use client"

import { useId, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Check, ChevronDown, Copy, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * A prompt readers can copy into their AI agent. Collapsed it shows only the first
 * lines, fading out; the button copies the whole text.
 *
 *   <PromptBlock title="Assess your design tokens">
 *   ```text
 *   You are reviewing…
 *   ```
 *   </PromptBlock>
 */
export function PromptBlock({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  const t = useTranslations("prompt")
  const body = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const bodyId = useId()
  const [copied, setCopied] = useState(false)

  async function copy() {
    const text = body.current?.querySelector("pre")?.textContent ?? body.current?.textContent ?? ""
    await navigator.clipboard.writeText(text.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <aside data-figure="prompt" className="prompt-block my-8 overflow-hidden rounded-xl border bg-muted/40 [--callout:var(--color-indigo-500)]">
      <div className="flex items-center gap-2.5 border-b px-4 py-2.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-(--callout)/15">
          <Sparkles className="size-4 text-(--callout)" aria-hidden />
        </span>
        <p className="m-0! min-w-0 flex-1 truncate text-sm font-semibold">{title ?? t("label")}</p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-xs font-semibold transition hover:bg-muted"
        >
          {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          {copied ? t("copied") : t("copy")}
        </button>
      </div>
      <div
        ref={body}
        id={bodyId}
        className={cn(
          "relative [&_figure]:my-0! [&_pre]:my-0! [&_pre]:rounded-none! [&_pre]:border-0! [&_pre]:bg-transparent! [&_pre]:text-[0.8rem] [&_pre]:whitespace-pre-wrap [&_pre~button]:hidden",
          !open && "max-h-40 overflow-hidden"
        )}
      >
        {children}
        {!open && (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-background/95 to-transparent" />
        )}
      </div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="flex w-full items-center justify-center gap-1.5 border-t px-4 py-2 text-xs font-semibold opacity-80 transition hover:bg-muted hover:opacity-100"
      >
        {open ? t("collapse") : t("expand")}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
    </aside>
  )
}
