/**
 * Global feature flags.
 * Set via environment variables — defaults to hidden so the blog
 * stays off in production until you're ready to launch it.
 */
export const BLOG_ENABLED = process.env.NEXT_PUBLIC_BLOG_ENABLED === "true"
