import type { Locale } from "@/i18n/routing"
import en from "./data/en"
import it from "./data/it"
import type { Content } from "./types"

export { site } from "./site"
export type * from "./types"

const content: Record<Locale, Content> = { en, it }

export function getContent(locale: Locale): Content {
  return content[locale]
}
