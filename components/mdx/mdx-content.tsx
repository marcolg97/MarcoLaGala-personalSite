import { cacheLife } from "next/cache"
import { cn } from "@/lib/utils"
import { MDXRemote } from "next-mdx-remote-client/rsc"
import type { MDXComponents } from "next-mdx-remote-client/rsc"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import { rehypeCaptions, remarkGithubAlerts } from "@/lib/mdx"
import { Callout } from "./callout"
import { CodeBlock } from "./code-block"
import { Figure } from "./figure"

function Anchored({
  as: Tag,
  id,
  children,
  className,
  ...props
}: { as: "h2" | "h3" } & React.ComponentProps<"h2">) {
  // Keep generated classes, e.g. the sr-only label of the footnotes section
  return (
    <Tag id={id} {...props} className={cn("group/heading", className)}>
      <a href={`#${id}`} className="heading-anchor">
        {children}
      </a>
    </Tag>
  )
}

function Anchor({ href = "", ...props }: React.ComponentProps<"a">) {
  const external = /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  )
}

const components: MDXComponents = {
  h2: (props) => <Anchored as="h2" {...props} />,
  h3: (props) => <Anchored as="h3" {...props} />,
  a: Anchor,
  pre: CodeBlock,
  Callout,
  Figure,
}

/** Localized labels that the Markdown pipeline adds to the output. */
export type MdxLabels = { footnotes: string; backToContent: string }

// Compiling MDX and highlighting code is the slow part of a post: cache the result per source
export async function MdxContent({
  source,
  labels,
}: {
  source: string
  labels: MdxLabels
}) {
  "use cache"
  cacheLife("max")

  return (
    <div className="article">
      <MDXRemote
        source={source}
        components={components}
        options={{
          disableImports: true,
          disableExports: true,
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkGithubAlerts],
            remarkRehypeOptions: {
              footnoteLabel: labels.footnotes,
              footnoteBackLabel: labels.backToContent,
            },
            rehypePlugins: [
              rehypeSlug,
              rehypeCaptions,
              [
                rehypePrettyCode,
                {
                  theme: { light: "github-light", dark: "github-dark-dimmed" },
                  keepBackground: false,
                  defaultLang: { block: "plaintext" },
                },
              ],
            ],
          },
        }}
      />
    </div>
  )
}
