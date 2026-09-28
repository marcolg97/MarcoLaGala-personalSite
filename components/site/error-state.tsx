"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { TriangleAlert } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

/** Shared body of the error.tsx boundaries. */
export function ErrorState({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const t = useTranslations("common")

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16">
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertDescription>{t("errorMessage")}</AlertDescription>
      </Alert>
      <Button variant="outline" onClick={reset} className="self-start">
        {t("tryAgain")}
      </Button>
    </div>
  )
}
