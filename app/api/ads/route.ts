import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"

const adSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  imageUrl: z.string().min(1),
  url: z.string().url().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  cityId: z.string().nullable().optional(),
  isSponsored: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get("categoryId")
    const cityId = searchParams.get("cityId")
    const active = searchParams.get("active") === "true"

    const where: any = {}

    if (categoryId) {
      where.categoryId = categoryId
    }
    if (cityId) {
      where.cityId = cityId
    }
    if (active) {
      const now = new Date()
      where.status = "ACTIVE"
      where.startDate = { lte: now }
      where.OR = [
        { endDate: null },
        { endDate: { gte: now } },
      ]
    }

    const ads = await prisma.advertisement.findMany({
      where,
      include: {
        category: true,
        city: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(ads)
  } catch (error) {
    console.error("Error fetching advertisements:", error)
    return NextResponse.json(
      { error: "Failed to fetch advertisements" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = adSchema.parse(body)

    const ad = await prisma.advertisement.create({
      data: {
        title: validatedData.title,
        content: validatedData.content || null,
        imageUrl: validatedData.imageUrl,
        url: validatedData.url || null,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        categoryId: validatedData.categoryId || null,
        cityId: validatedData.cityId || null,
        isSponsored: validatedData.isSponsored,
        status: "ACTIVE",
      },
      include: {
        category: true,
        city: true,
      },
    })

    return NextResponse.json(ad, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating advertisement:", error)
    return NextResponse.json(
      { error: "Failed to create advertisement" },
      { status: 500 }
    )
  }
}

