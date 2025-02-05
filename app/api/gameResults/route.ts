import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    const results = await prisma.gameResult.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(results)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { winner } = await request.json()
    const result = await prisma.gameResult.create({
      data: {
        winner
      }
    })
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 })
  }
}
