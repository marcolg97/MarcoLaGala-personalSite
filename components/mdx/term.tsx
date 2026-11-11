/**
 * A new concept, the first time a post introduces it: bold, with a highlighter stroke
 * that sweeps in when the reader reaches it (<ArticleAnimations> sets `data-seen`).
 *
 *   These raw values are called <Term>primitives</Term>.
 */
export function Term({ children }: { children: React.ReactNode }) {
  return <strong className="term">{children}</strong>
}

/**
 * A sentence that describes a mistake: red, with a wavy underline like a spell checker,
 * and a small error icon in front.
 *
 *   It works, but <Mistake>this token is for one component only</Mistake>.
 */
export function Mistake({ children }: { children: React.ReactNode }) {
  return (
    <strong className="font-semibold text-[#C9302C] decoration-[#E5484D] decoration-wavy decoration-from-font underline-offset-4 [text-decoration-line:underline] dark:text-[#FF6B6B]">
      <span aria-hidden className="mr-1 inline-block rounded-full bg-[#E5484D] px-1.5 align-[0.1em] text-[0.7em] leading-[1.4] text-white no-underline">
        ✕
      </span>
      {children}
    </strong>
  )
}
