/**
 * The blob family: one lilac character with the same body, outline, feet and cheeks,
 * in different moods. Styles and animations live in `.article .blob-thought`
 * (globals.css); <ArticleAnimations> plays them only while they're on screen.
 *
 *   <BlobThought>Not us.</BlobThought>          grumpy, thinking (thought bubble)
 *   <BlobSays>Can the buttons be teal?</BlobSays> cheerful, in a bow tie (speech bubble)
 *   <BlobPainter />                              happy painter in a beret, no bubble
 *   <BlobTrophyArt />                            cheering with a trophy (used by <Achievement trophy>)
 */

const INK = "#1E1A2B"
const OUTLINE = "#3B3550"
const BODY = "#C9BFFF"
const LIMB = "#C2B8FC"
const FOOT = "#B3A6F7"
const CHEEK = "#FF99AB"
const BODY_PATH =
  "M100 20 C 150 20 178 60 178 102 C 178 144 146 164 100 164 C 54 164 22 144 22 102 C 22 60 50 20 100 20 Z"

/** Shadow and feet: drawn first, they never move. */
function Ground() {
  return (
    <>
      <ellipse cx="100" cy="172" rx="56" ry="7" fill="currentColor" opacity="0.08" />
      <ellipse cx="78" cy="162" rx="15" ry="8" fill={FOOT} stroke={OUTLINE} strokeWidth="2" />
      <ellipse cx="122" cy="162" rx="15" ry="8" fill={FOOT} stroke={OUTLINE} strokeWidth="2" />
    </>
  )
}

/** The body with its shine, and the cheeks. */
function Body({ cheeks = 0.65 }: { cheeks?: number }) {
  return (
    <>
      <path d={BODY_PATH} fill={BODY} stroke={OUTLINE} strokeWidth="2" />
      <ellipse cx="68" cy="54" rx="16" ry="8" fill="#FFFFFF" opacity="0.55" transform="rotate(-28 68 54)" />
      <ellipse cx="58" cy="114" rx="11" ry="6" fill={CHEEK} opacity={cheeks} />
      <ellipse cx="142" cy="114" rx="11" ry="6" fill={CHEEK} opacity={cheeks} />
    </>
  )
}

/** An arm drawn as a thick outlined stroke. */
function Arm({ d }: { d: string }) {
  return (
    <>
      <path d={d} stroke={OUTLINE} strokeWidth="21" strokeLinecap="round" />
      <path d={d} stroke={LIMB} strokeWidth="17" strokeLinecap="round" />
    </>
  )
}

/** Round open eyes with a shine. */
function OpenEyes() {
  return (
    <>
      <ellipse cx="78" cy="94" rx="8" ry="9.5" fill={INK} />
      <ellipse cx="122" cy="94" rx="8" ry="9.5" fill={INK} />
      <circle cx="81" cy="90" r="3" fill="#FFFFFF" />
      <circle cx="125" cy="90" r="3" fill="#FFFFFF" />
    </>
  )
}

export function BlobThought({ children }: { children: React.ReactNode }) {
  return (
    <div className="blob-thought">
      <GrumpyBlob />
      <span className="blob-thought__dots" aria-hidden="true">
        <span />
        <span />
      </span>
      <p className="blob-thought__bubble">{children}</p>
    </div>
  )
}

/** Sulking, not angry: soft frown, half-closed eyes, puffed cheeks, a pout, crossed arms. */
function GrumpyBlob() {
  return (
    <svg className="blob-thought__blob" viewBox="0 0 200 182" aria-hidden="true" fill="none">
      <Ground />
      <g className="blob-thought__body">
        <Body cheeks={0.85} />
        {/* A little "hmph" mark */}
        <path d="M150 34 q 6 6 0 12 M158 30 q -6 6 0 12 M144 40 q 6 -6 12 0 M144 48 q 6 6 12 0" stroke="#E5484D" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M64 80 Q 76 80 86 87" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M136 80 Q 124 80 114 87" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
        <g className="blob-thought__eye">
          <path d="M70 98 A 8 8 0 0 0 86 98 Z" fill={INK} />
          <path d="M68 97.5 H 88" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <g className="blob-thought__eye">
          <path d="M114 98 A 8 8 0 0 0 130 98 Z" fill={INK} />
          <path d="M112 97.5 H 132" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Pout */}
        <path d="M92 122 Q 96 117 100 121 Q 104 117 108 122" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* Crossed arms */}
        <rect x="74" y="130" width="78" height="19" rx="9.5" fill="#B9AEFB" stroke={OUTLINE} strokeWidth="2" transform="rotate(-13 113 139.5)" />
        <rect x="48" y="130" width="78" height="19" rx="9.5" fill={LIMB} stroke={OUTLINE} strokeWidth="2" transform="rotate(13 87 139.5)" />
      </g>
    </svg>
  )
}

export function BlobSays({ children }: { children: React.ReactNode }) {
  return (
    <div className="blob-thought blob-thought--says">
      <ElegantBlob />
      <p className="blob-thought__bubble">
        {/* The tail: its right edge overlaps the bubble's border and covers it */}
        <svg className="blob-thought__tail" viewBox="0 0 18 22" aria-hidden="true">
          <path d="M16 2 C 11 7 6 9.5 1 11 C 6 12.5 11 15 16 20" />
          <rect x="14.5" y="3" width="3.5" height="16" />
        </svg>
        {children}
      </p>
    </div>
  )
}

/** Cheerful, waving, in a navy bow tie. */
function ElegantBlob() {
  return (
    <svg className="blob-thought__blob" viewBox="0 0 200 182" aria-hidden="true" fill="none">
      <Ground />
      <g className="blob-thought__body">
        <g className="blob-thought__wave">
          <Arm d="M166 106 Q 184 88 186 64" />
        </g>
        <Body cheeks={0.7} />
        <path d="M66 96 Q 76 84 86 96" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M114 96 Q 124 84 134 96" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M84 110 Q 100 132 116 110 Z" fill={INK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M92 120 Q 100 126 108 120" stroke="#FF8FA3" strokeWidth="4" strokeLinecap="round" />
        <path d="M100 145 L 78 134 Q 74 145 78 156 Z" fill="#2B2F6B" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
        <path d="M100 145 L 122 134 Q 126 145 122 156 Z" fill="#2B2F6B" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
        <rect x="94" y="139" width="12" height="12" rx="3.5" fill="#3A3F86" stroke={OUTLINE} strokeWidth="2" />
      </g>
    </svg>
  )
}

/**
 * Happy painter in a red beret, holding a brush dipped in `paint`. No bubble: use it
 * inside a figure.
 */
export function BlobPainter({ paint = "#F5B400" }: { paint?: string }) {
  return (
    <svg
      viewBox="0 0 232 182"
      style={{ width: "min(36%, 11rem)", minWidth: "7.5rem" }}
      className="blob-painter"
      aria-hidden="true"
      fill="none"
    >
      <Ground />
      <g className="blob-painter__body">
        <g className="blob-painter__arm">
          <Arm d="M166 108 Q 182 94 190 76" />
          <path d="M190 76 L 206 52" stroke="#A0703F" strokeWidth="6" strokeLinecap="round" />
          <path d="M206 52 L 212 43" stroke="#98989D" strokeWidth="7" />
          <path d="M212 43 L 222 28" stroke={paint} strokeWidth="9" strokeLinecap="round" />
          <circle cx="190" cy="76" r="9" fill={LIMB} stroke={OUTLINE} strokeWidth="2" />
        </g>
        <Body />
        {/* Beret */}
        <path d="M56 34 C 66 10 136 8 146 30 C 130 38 76 40 56 34 Z" fill="#C62F45" stroke={OUTLINE} strokeWidth="2" strokeLinejoin="round" />
        <path d="M100 12 L 102 4" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
        <OpenEyes />
        {/* Focused little smile, tongue out */}
        <path d="M88 116 Q 100 128 112 116" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <path d="M104 121 Q 108 128 112 123" fill="#FF8FA3" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

/** Cheering, holding a golden trophy over its head. Just the drawing: <Achievement trophy> frames it. */
export function BlobTrophyArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 -78 200 260" aria-hidden="true" fill="none">
      <Ground />
      <g className="blob-trophy__body">
        <Arm d="M42 92 Q 30 40 78 -6" />
        <Arm d="M158 92 Q 170 40 122 -6" />
        {/* Trophy */}
        <g stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round">
          <path d="M74 -50 C 56 -50 56 -26 78 -24" fill="none" />
          <path d="M126 -50 C 144 -50 144 -26 122 -24" fill="none" />
          <path d="M72 -64 H 128 V -44 C 128 -24 116 -12 100 -12 C 84 -12 72 -24 72 -44 Z" fill="#F5B400" />
          <rect x="94" y="-12" width="12" height="12" fill="#E0A100" />
          <rect x="80" y="0" width="40" height="10" rx="3" fill="#B58200" />
        </g>
        <path d="M84 -56 Q 84 -36 94 -28" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
        <circle cx="78" cy="-6" r="10" fill={LIMB} stroke={OUTLINE} strokeWidth="2" />
        <circle cx="122" cy="-6" r="10" fill={LIMB} stroke={OUTLINE} strokeWidth="2" />
        <Body cheeks={0.75} />
        <path d="M66 96 Q 76 84 86 96" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M114 96 Q 124 84 134 96" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M82 110 Q 100 136 118 110 Z" fill={INK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M91 121 Q 100 128 109 121" stroke="#FF8FA3" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  )
}

/** Finger on its lips, one eye winking: for the things kept secret until now. */
export function BlobShh({ children = "shhh…" }: { children?: React.ReactNode }) {
  return (
    <figure className="not-prose my-6 flex justify-center">
      <svg
        viewBox="0 0 280 182"
        style={{ width: "min(70%, 17rem)" }}
        className="blob-shh"
        role="img"
        aria-label="The blob puts a finger on its lips and winks: it's a secret."
        fill="none"
      >
        <Ground />
        <g className="blob-shh__body">
          <Body cheeks={0.85} />
          {/* Winking left eye, open right eye */}
          <path d="M68 96 Q 78 86 88 96" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="122" cy="94" rx="8" ry="9.5" fill={INK} />
          <circle cx="125" cy="90" r="3" fill="#FFFFFF" />
          {/* Pursed lips, behind the finger */}
          <ellipse cx="100" cy="120" rx="6" ry="5" fill={INK} />
          {/* Arm up to the mouth, index finger over the lips */}
          <Arm d="M150 150 Q 136 140 112 134" />
          <rect x="95" y="96" width="11" height="34" rx="5.5" fill={LIMB} stroke={OUTLINE} strokeWidth="2" />
          <circle cx="106" cy="134" r="11" fill={LIMB} stroke={OUTLINE} strokeWidth="2" />
        </g>
        <g className="blob-shh__text" fill="#6E56CF" stroke="none">
          <text className="hand" x="190" y="76" fontSize="34" transform="rotate(-8 190 76)">
            {children}
          </text>
          <path d="M184 92 q 10 -6 20 0 q 10 6 20 0" stroke="#6E56CF" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
        </g>
      </svg>
    </figure>
  )
}
