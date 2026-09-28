import Image from "next/image"
import { useTranslations } from "next-intl"
import { ArrowUpRight } from "lucide-react"
import type { App } from "@/content"

/** Cards with the icons of the apps I worked on, linking to the App Store. */
export function AppShowcase({ apps }: { apps: App[] }) {
  const t = useTranslations("about")

  return (
    // On large screens the four cards sit on one row, wider than the text column
    <ul className="grid gap-3 sm:grid-cols-2 lg:relative lg:left-1/2 lg:w-[min(56rem,calc(100vw-3rem))] lg:-translate-x-1/2 lg:grid-cols-4">
      {apps
        .filter((app) => app.showcase !== false)
        .map((app) => (
          <li key={app.name}>
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("openOnAppStore", { app: app.name })}
              className="group flex h-full items-center gap-4 rounded-2xl border bg-card p-4 transition duration-200 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:flex-col sm:items-start"
            >
              <Image
                src={app.icon}
                alt=""
                width={56}
                height={56}
                className="size-14 shrink-0 rounded-[22%] shadow-sm ring-1 ring-black/5 dark:ring-white/10"
              />
              <div className="flex flex-1 flex-col gap-1">
                <p className="leading-tight font-semibold">{app.name}</p>
                <p className="text-sm text-pretty text-muted-foreground">
                  {app.context}
                </p>
              </div>
              <span className="hidden items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground sm:inline-flex">
                App Store
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </li>
        ))}
    </ul>
  )
}
