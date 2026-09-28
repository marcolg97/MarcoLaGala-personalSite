import { readFile } from "node:fs/promises"
import path from "node:path"

// The site font (DM Sans, OFL — see assets/fonts/OFL.txt) for generated images.
// next/og can't read woff2, so the woff files live in the repo.
const load = (weight: 400 | 700) =>
  readFile(path.join(process.cwd(), `assets/fonts/dm-sans-${weight}.woff`))

type OgFont = {
  name: string
  data: Buffer
  weight: 400 | 700
  style: "normal"
}

let fonts: Promise<OgFont[]> | undefined

// Read once per server instance, shared by every generated image
export function ogFonts(): Promise<OgFont[]> {
  fonts ??= Promise.all([load(400), load(700)]).then(([regular, bold]) => [
    { name: "DM Sans", data: regular, weight: 400, style: "normal" },
    { name: "DM Sans", data: bold, weight: 700, style: "normal" },
  ])
  return fonts
}
