import type { Metadata } from "next"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = { title: "404 — Page not found" }

// URLs outside any locale (the proxy redirects almost everything to /en or /it)
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center font-sans">
        <h1 className="text-2xl font-semibold">404 — Page not found</h1>
        <Link
          href="/"
          className="text-muted-foreground underline underline-offset-4"
        >
          Back to home
        </Link>
      </body>
    </html>
  )
}
