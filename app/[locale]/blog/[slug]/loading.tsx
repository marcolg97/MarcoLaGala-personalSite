import { Skeleton } from "@/components/ui/skeleton"

export default function BlogPostLoading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <Skeleton className="mb-10 h-5 w-28" />
      <div className="flex max-w-2xl flex-col gap-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="mt-8 h-96" />
      </div>
    </div>
  )
}
