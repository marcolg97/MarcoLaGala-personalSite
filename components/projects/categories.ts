import { Globe, Smartphone, Sparkles } from "lucide-react"
import type { Project } from "@/content"

/** Order and icon of each project category. */
export const projectCategories: {
  id: Project["category"]
  icon: typeof Globe
}[] = [
  { id: "mobile", icon: Smartphone },
  { id: "web", icon: Globe },
  { id: "ai", icon: Sparkles },
]
