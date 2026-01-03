import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const grievance = await prisma.grievance.update({
      where: { id: params.id },
      data: {
        status: "REJECTED",
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
    console.error("Error rejecting grievance:", error)
    return NextResponse.json(
      { error: "Failed to reject grievance" },
      { status: 500 }
    )
  }
}

