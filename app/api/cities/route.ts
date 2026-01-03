import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"

const citySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  state: z.string().optional(),
})

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(cities)
  } catch (error) {
    console.error("Error fetching cities:", error)
    return NextResponse.json(
      { error: "Failed to fetch cities" },
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
    const validatedData = citySchema.parse(body)

    const city = await prisma.city.create({
      data: validatedData,
    })

    return NextResponse.json(city, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating city:", error)
    return NextResponse.json(
      { error: "Failed to create city" },
      { status: 500 }
    )
  }
}

