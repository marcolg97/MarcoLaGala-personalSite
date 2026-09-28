/**
 * A captioned figure for anything that isn't a plain image or table:
 *
 *   <Figure caption="How the router resolves a deeplink">
 *     <video src="..." controls />
 *   </Figure>
 *
 * With `src` it renders an image: <Figure src="..." alt="..." caption="..." />
 */
export function Figure({
  src,
  alt = "",
  caption,
  children,
}: {
  src?: string
  alt?: string
  caption?: string
  children?: React.ReactNode
}) {
  return (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element -- remote post images, sizes unknown */}
      {src ? <img src={src} alt={alt} /> : children}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
