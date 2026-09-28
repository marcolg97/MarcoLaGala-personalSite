/** A job or a course in the About timeline. */
export type TimelineEntry = {
  title: string
  organization: string
  period: string
  description: string
  tags: string[]
  /** Links the title, e.g. the course page */
  url?: string
  /** Links the organization name, e.g. its LinkedIn page */
  organizationUrl?: string
}

/** An app I worked on, highlighted on the About page. */
export type App = {
  name: string
  /** Company and my role, e.g. "TheFork · Platform team" */
  context: string
  /** Path of the icon in public/apps */
  icon: string
  url: string
  /** Show a card at the top of the About page (default); false = only highlighted in the text */
  showcase?: boolean
}

export type Education = {
  degree: string
  institution: string
  period: string
  grade?: string
}

export type Project = {
  title: string
  description: string
  tags: string[]
  category: "mobile" | "web" | "ai"
  /** Shown on the home page */
  featured: boolean
  url?: string
  github?: string
  /** Cover image path in public/, 16:9 (optional) */
  image?: string
}

/** Localized site content, stored in content/data/<locale>.ts. */
export type Content = {
  profile: { role: string; location: string; bio: string }
  skills: string[]
  work: TimelineEntry[]
  apps: App[]
  courses: TimelineEntry[]
  education: Education[]
  projects: Project[]
}
