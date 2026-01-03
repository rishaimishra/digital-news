import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"

const resolveSchema = z.object({
  resolution: z.string().min(1),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = resolveSchema.parse(body)

    const grievance = await prisma.grievance.update({
      where: { id: params.id },
      data: {
        status: "RESOLVED",
        resolution: validatedData.resolution,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(grievance)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error resolving grievance:", error)
    return NextResponse.json(
      { error: "Failed to resolve grievance" },
      { status: 500 }
    )
  }
}

