/**
 * A hand-made correction: the old words struck through in red pen, the new ones
 * scribbled above them. Styles live in `.article .pen-fix` (globals.css).
 *
 *   A handful of <PenFix from="developers" to="agents" />, dozens of screens.
 */
export function PenFix({ from, to }: { from: string; to: string }) {
  return (
    <span className="pen-fix">
      <del>{from}</del>
      <ins>{to}</ins>
    </span>
  )
}
