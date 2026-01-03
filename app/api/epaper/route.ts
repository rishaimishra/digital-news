import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"

const epaperSchema = z.object({
  date: z.string(),
  cityId: z.string().nullable().optional(),
  language: z.string().default("en"),
  fileUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  pageCount: z.number().default(0),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cityId = searchParams.get("cityId")
    const language = searchParams.get("language")
    const date = searchParams.get("date")

    const where: any = {
      status: "PUBLISHED",
    }

    if (cityId) {
      where.cityId = cityId
    }
    if (language) {
      where.language = language
    }
    if (date) {
      where.date = new Date(date)
    }

    const epapers = await prisma.ePaper.findMany({
      where,
      include: {
        city: true,
        pages: {
          orderBy: {
            pageNumber: "asc",
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: 50,
    })

    return NextResponse.json(epapers)
  } catch (error) {
    console.error("Error fetching e-papers:", error)
    return NextResponse.json(
      { error: "Failed to fetch e-papers" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = epaperSchema.parse(body)

    const epaper = await prisma.ePaper.create({
      data: {
        date: new Date(validatedData.date),
        cityId: validatedData.cityId || null,
        language: validatedData.language,
        fileUrl: validatedData.fileUrl || null,
        thumbnailUrl: validatedData.thumbnailUrl || null,
        pageCount: validatedData.pageCount,
        status: "PUBLISHED",
      },
      include: {
        city: true,
        pages: true,
      },
    })

    return NextResponse.json(epaper, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating e-paper:", error)
    return NextResponse.json(
      { error: "Failed to create e-paper" },
      { status: 500 }
    )
  }
}

