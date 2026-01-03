import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"

const grievanceSchema = z.object({
  subject: z.string().min(1),
  description: z.string().min(1),
  articleId: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Admins can see all, others only their own
    const where: any =
      session.user.role === UserRole.ADMIN
        ? {}
        : { userId: session.user.id }

    const grievances = await prisma.grievance.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        article: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(grievances)
  } catch (error) {
    console.error("Error fetching grievances:", error)
    return NextResponse.json(
      { error: "Failed to fetch grievances" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = grievanceSchema.parse(body)

    const grievance = await prisma.grievance.create({
      data: {
        subject: validatedData.subject,
        description: validatedData.description,
        userId: session.user.id,
        articleId: validatedData.articleId || null,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        article: {
          select: {
            title: true,
          },
        },
      },
    })

    return NextResponse.json(grievance, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating grievance:", error)
    return NextResponse.json(
      { error: "Failed to create grievance" },
      { status: 500 }
    )
  }
}

