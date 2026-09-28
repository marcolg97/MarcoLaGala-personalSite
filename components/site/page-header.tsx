export function PageHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <header className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      {description && (
        <p className="text-pretty text-muted-foreground">{description}</p>
      )}
    </header>
  )
}
