import { NextRequest, NextResponse } from 'next/server'
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('contactId') || '1'
  const res = await fetch(`http://localhost:3001/contacts/${id}/interactions`)
  const data = await res.json()
  return NextResponse.json(data)
}
