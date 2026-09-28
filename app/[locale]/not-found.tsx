import { getTranslations } from "next-intl/server"
import { House } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

export default async function NotFound() {
  const t = await getTranslations("notFound")

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-8xl font-bold tracking-tight text-muted-foreground/30">
        404
      </p>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <Button asChild>
        <Link href="/">
          <House aria-hidden />
          {t("backHome")}
        </Link>
      </Button>
    </div>
  )
}
