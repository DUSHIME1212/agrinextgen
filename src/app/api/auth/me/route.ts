import { authenticate } from "@/middleware/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { error, status, user } = await authenticate(req)

  if (error) {
    return NextResponse.json({ error }, { status })
  }

  return NextResponse.json({ user })
}

