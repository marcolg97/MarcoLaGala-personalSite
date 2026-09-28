"use client"

import { useState, useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { Languages, Menu, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { routing, type Locale } from "@/i18n/routing"
import { BLOG_ENABLED } from "@/lib/flags"
import { cn } from "@/lib/utils"

type NavLink = { href: string; key: "home" | "blog" | "projects" | "about" }

const navLinks: NavLink[] = [
  { href: "/", key: "home" },
  ...(BLOG_ENABLED ? [{ href: "/blog", key: "blog" } as const] : []),
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
]

// Language names are shown in their own language
const localeNames: Record<Locale, string> = { en: "English", it: "Italiano" }

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("nav")
  // Pathname without the locale prefix, e.g. "/blog/my-post"
  const pathname = usePathname()

  return navLinks.map(({ href, key }) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
    return (
      <Link
        key={href}
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {t(key)}
      </Link>
    )
  })
}

function MobileMenu() {
  const t = useTranslations("header")
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-11 md:hidden"
          aria-label={t("menu")}
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetTitle className="sr-only">{t("menu")}</SheetTitle>
        <SheetDescription className="sr-only">
          {t("menuDescription")}
        </SheetDescription>
        <nav className="flex flex-col gap-2 px-2 pt-8 [&>a]:py-3">
          <NavLinks onNavigate={() => setOpen(false)} />
        </nav>
      </SheetContent>
    </Sheet>
  )
}

function LocaleSwitcher() {
  const t = useTranslations("header")
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function switchTo(next: string) {
    startTransition(() => router.replace(pathname, { locale: next as Locale }))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={t("language")}
          className={cn("h-11", isPending && "opacity-60")}
        >
          <Languages data-icon="inline-start" />
          {locale.toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={locale} onValueChange={switchTo}>
          {routing.locales.map((code) => (
            <DropdownMenuRadioItem key={code} value={code} lang={code}>
              {localeNames[code]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ThemeToggle() {
  const t = useTranslations("header")
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-11"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={t("toggleTheme")}
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  )
}

export function Header() {
  const t = useTranslations("header")

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-6">
        {/* Negative margins line up the link and icon text with the page content */}
        <div className="-ml-3 flex items-center gap-1">
          <MobileMenu />
          <nav
            aria-label={t("mainNavigation")}
            className="hidden items-center gap-1 md:flex"
          >
            <NavLinks />
          </nav>
        </div>
        <div className="-mr-3 flex items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
