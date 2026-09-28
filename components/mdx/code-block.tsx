"use client"

import { useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Check, Copy } from "lucide-react"

export function CodeBlock(props: React.ComponentProps<"pre">) {
  const t = useTranslations("code")
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(ref.current?.textContent ?? "")
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="group/code relative">
      <pre ref={ref} {...props} />
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? t("copied") : t("copy")}
        className="absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-md border bg-background/80 text-muted-foreground opacity-0 backdrop-blur transition group-hover/code:opacity-100 hover:text-foreground focus-visible:opacity-100 pointer-coarse:opacity-100"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
    </div>
  )
}
