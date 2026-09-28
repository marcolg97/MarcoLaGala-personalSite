import type { MetadataRoute } from "next"
import { site } from "@/content"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.initials,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    // Same as the light theme-color in app/[locale]/layout.tsx
    theme_color: "#ffffff",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  }
}
