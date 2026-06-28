import { NextRequest, NextResponse } from 'next/server'
export async function GET() {
  const res = await fetch('http://localhost:3001/contacts')
  const data = await res.json()
  return NextResponse.json(data)
}
export async function POST(req: NextRequest) {
  const body = await req.json()
  const res = await fetch('http://localhost:3001/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const data = await res.json()
  return NextResponse.json(data)
}
