import { renderIcon } from "@/lib/icon"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

// iOS applies its own rounded mask, so the square stays square
export default async function AppleIcon() {
  return renderIcon(180, 0)
}
