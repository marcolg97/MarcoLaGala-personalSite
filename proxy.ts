import createMiddleware from "next-intl/middleware"
import { routing } from "@/i18n/routing"

export default createMiddleware(routing)

export const config = {
  matcher: [
    // Everything except API routes, Next.js internals, generated icons and static files
    "/((?!api|_next|_vercel|icon|apple-icon|.*\\..*).*)",
  ],
}
