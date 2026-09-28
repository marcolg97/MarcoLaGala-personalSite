import { ImageResponse } from "next/og"
import { site } from "@/content"
import { ogFonts } from "./og-fonts"

/** Size shared by every social preview image. */
export const ogSize = { width: 1200, height: 630 }

const colors = {
  background: "#0f1113",
  text: "#f4f5f6",
  muted: "#a1a8b0",
  accent: "#1c7fc4",
}

/** The social preview image: site name, a title and an optional description. */
export async function renderOgImage({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  const host = new URL(site.url).host

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: colors.background,
        fontFamily: "DM Sans",
        color: colors.text,
        borderTop: `8px solid ${colors.accent}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: 16,
            background: colors.accent,
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          {site.initials}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: colors.muted }}>
          {site.name}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 50 ? 56 : 68,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.4,
              color: colors.muted,
            }}
          >
            {description.length > 150
              ? `${description.slice(0, 147)}…`
              : description}
          </div>
        )}
      </div>

      <div style={{ display: "flex", fontSize: 24, color: colors.muted }}>
        {host}
      </div>
    </div>,
    { ...ogSize, fonts: await ogFonts() }
  )
}
