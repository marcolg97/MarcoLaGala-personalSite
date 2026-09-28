import crypto from "node:crypto"
import { revalidateTag } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"

/**
 * GitHub webhook (push on the content repo) → refresh posts without a redeploy.
 * Webhook settings: payload URL `/api/revalidate`, content type `application/json`,
 * secret = REVALIDATE_SECRET.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret)
    return NextResponse.json({ error: "Not configured" }, { status: 500 })

  const body = await request.text()
  const signature = request.headers.get("x-hub-signature-256") ?? ""
  const expected = `sha256=${crypto.createHmac("sha256", secret).update(body).digest("hex")}`

  const valid =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  if (!valid)
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })

  revalidateTag("posts", { expire: 0 })
  return NextResponse.json({ revalidated: true })
}
