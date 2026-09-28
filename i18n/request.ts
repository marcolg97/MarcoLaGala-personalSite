import { notFound } from "next/navigation"
import * as rootParams from "next/root-params"
import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ locale }) => {
  // An explicit locale (e.g. getTranslations({ locale })) wins; otherwise read the
  // [locale] root param. Route Handlers and Server Actions have no root params.
  if (!locale) {
    const param = await rootParams.locale()
    if (!hasLocale(routing.locales, param)) notFound()
    locale = param
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
