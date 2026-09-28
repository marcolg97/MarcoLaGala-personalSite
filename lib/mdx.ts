import GithubSlugger from "github-slugger"
import type { Element, ElementContent, Root as HastRoot } from "hast"
import type { Blockquote, Paragraph, Root } from "mdast"
import { SKIP, visit } from "unist-util-visit"

export type Heading = {
  text: string
  slug: string
  level: 2 | 3
}

/** Same slugs as rehype-slug, so TOC links match the rendered heading ids. */
export function extractHeadings(source: string): Heading[] {
  const slugger = new GithubSlugger()
  // Ignore "#" lines inside fenced code blocks
  const withoutCode = source.replace(/^```[\s\S]*?^```/gm, "")
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: Heading[] = []
  let match

  while ((match = headingRegex.exec(withoutCode)) !== null) {
    const level = match[1].length as 2 | 3
    const text = match[2]
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1")
      .trim()

    headings.push({ text, slug: slugger.slug(text), level })
  }

  return headings
}

export const CALLOUT_TYPES = [
  "note",
  "tip",
  "important",
  "warning",
  "caution",
] as const
export type CalloutType = (typeof CALLOUT_TYPES)[number]

/**
 * Turns GitHub alerts into <Callout>, so posts render nicely on GitHub too:
 *
 *   > [!TIP]
 *   > Text
 */
export function remarkGithubAlerts() {
  return (tree: Root) => {
    visit(tree, "blockquote", (node: Blockquote, index, parent) => {
      const first = node.children[0] as Paragraph | undefined
      const text = first?.type === "paragraph" ? first.children[0] : undefined
      if (!parent || index === undefined || text?.type !== "text") return

      const match = text.value.match(/^\[!(\w+)\][ \t]*(.*?)(?:\n|$)/)
      const type = match?.[1].toLowerCase() as CalloutType | undefined
      if (!match || !type || !CALLOUT_TYPES.includes(type)) return

      text.value = text.value.slice(match[0].length)
      if (!text.value && first!.children.length === 1) node.children.shift()

      const attributes: {
        type: "mdxJsxAttribute"
        name: string
        value: string
      }[] = [{ type: "mdxJsxAttribute", name: "type", value: type }]
      if (match[2])
        attributes.push({
          type: "mdxJsxAttribute",
          name: "title",
          value: match[2],
        })

      parent.children[index] = {
        type: "mdxJsxFlowElement",
        name: "Callout",
        attributes,
        children: node.children,
      } as unknown as Blockquote
    })
  }
}

const TABLE_CAPTION = /^(?:Table|Tabella):\s*/

function isBlank(node: ElementContent | undefined) {
  return node?.type === "text" && !node.value.trim()
}

function figure(content: ElementContent[], caption: ElementContent[]): Element {
  return {
    type: "element",
    tagName: "figure",
    properties: {},
    children: [
      ...content,
      {
        type: "element",
        tagName: "figcaption",
        properties: {},
        children: caption,
      },
    ],
  }
}

/**
 * Captions with plain Markdown, so posts still read well on GitHub:
 *
 *   ![Alt text](image.png "Caption")      → <figure> with the title as caption
 *
 *   | A | B |
 *   | - | - |
 *   Table: Caption                        → <figure> around the table
 */
export function rehypeCaptions() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node, index, parent) => {
      if (!parent || index === undefined) return

      // An image alone in its paragraph, with a title
      if (node.tagName === "p") {
        const content = node.children.filter((child) => !isBlank(child))
        const [image] = content
        if (
          content.length === 1 &&
          image.type === "element" &&
          image.tagName === "img" &&
          typeof image.properties.title === "string"
        ) {
          const caption = image.properties.title
          delete image.properties.title
          parent.children[index] = figure(
            [image],
            [{ type: "text", value: caption }]
          )
        }
        return
      }

      // A table followed by a "Table: ..." paragraph
      if (node.tagName === "table") {
        let next = index + 1
        while (isBlank(parent.children[next] as ElementContent)) next++
        const paragraph = parent.children[next]
        if (paragraph?.type !== "element" || paragraph.tagName !== "p") return

        const first = paragraph.children[0]
        if (first?.type !== "text" || !TABLE_CAPTION.test(first.value)) return

        first.value = first.value.replace(TABLE_CAPTION, "")
        parent.children.splice(
          index,
          next - index + 1,
          figure([node], paragraph.children)
        )
        return [SKIP, index + 1]
      }
    })
  }
}
