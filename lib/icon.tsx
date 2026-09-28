import { ImageResponse } from "next/og"
import { site } from "@/content"
import { ogFonts } from "./og-fonts"

/** The site monogram, used for the favicon and the iOS home screen icon. */
export async function renderIcon(size: number, radius: number) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius,
        background: "#1c7fc4",
        fontFamily: "DM Sans",
        color: "#ffffff",
        fontSize: size * 0.44,
        fontWeight: 700,
        letterSpacing: "-0.04em",
      }}
    >
      {site.initials}
    </div>,
    { width: size, height: size, fonts: await ogFonts() }
  )
}
