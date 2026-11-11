import { cacheLife } from "next/cache"
import { cn } from "@/lib/utils"
import { MDXRemote } from "next-mdx-remote-client/rsc"
import type { MDXComponents } from "next-mdx-remote-client/rsc"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import { rehypeCaptions, remarkGithubAlerts } from "@/lib/mdx"
import { Achievement } from "./achievement"
import { ArticleAnimations } from "./article-animations"
import { BlobPainter, BlobSays, BlobShh, BlobThought } from "./blob-thought"
import { Callout } from "./callout"
import { CodeBlock } from "./code-block"
import { Figure } from "./figure"
import { PenFix } from "./pen-fix"
import { PromptBlock } from "./prompt-block"
import { SemanticTable } from "./semantic-table"
import { Status } from "./status"
import { Step, Steps } from "./steps"
import { Mistake, Term } from "./term"
import { ThemePlayground } from "./theme-playground"
import { TokenAnatomy } from "./token-anatomy"
import { TokenGraph } from "./token-graph"
import { SchemeSwitch } from "./scheme-switch"
import { TokenSprawl } from "./token-sprawl"
import { TokenChain, TokenGrid } from "./token-cost"
import { TokenLayers } from "./token-layers"
import { TokenPointer } from "./token-pointer"
import { TokenTiers } from "./token-tiers"

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

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i

/** Inline code. A hex color like `#F2711C` gets a dot of that color in front, as on GitHub. */
function InlineCode({ children, ...props }: React.ComponentProps<"code">) {
  if (typeof children === "string" && HEX_COLOR.test(children)) {
    return (
      <code {...props}>
        <span
          aria-hidden
          className="mr-1.5 inline-block size-[0.7em] rounded-full align-[-0.02em] ring-1 ring-current/25"
          style={{ background: children }}
        />
        {children}
      </code>
    )
  }
  return <code {...props}>{children}</code>
}

const components: MDXComponents = {
  code: InlineCode,
  Achievement,
  h2: (props) => <Anchored as="h2" {...props} />,
  h3: (props) => <Anchored as="h3" {...props} />,
  a: Anchor,
  pre: CodeBlock,
  BlobPainter,
  BlobShh,
  BlobSays,
  BlobThought,
  Callout,
  Figure,
  PenFix,
  PromptBlock,
  SemanticTable,
  Status,
  Step,
  Steps,
  Term,
  Mistake,
  ThemePlayground,
  TokenAnatomy,
  TokenGraph,
  SchemeSwitch,
  TokenSprawl,
  TokenChain,
  TokenGrid,
  TokenLayers,
  TokenPointer,
  TokenTiers,
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
      <ArticleAnimations />
    </div>
  )
}
