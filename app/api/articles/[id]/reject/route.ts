import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"

const rejectSchema = z.object({
  reason: z.string().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (
      session.user.role !== UserRole.EDITOR &&
      session.user.role !== UserRole.ADMIN
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = rejectSchema.parse(body)

    const article = await prisma.newsArticle.findUnique({
      where: { id: params.id },
    })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const updatedArticle = await prisma.newsArticle.update({
      where: { id: params.id },
      data: {
        status: "REJECTED",
        editorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        editor: {
          select: {
            id: true,
            name: true,
          },
        },
        category: true,
        city: true,
        tags: true,
      },
    })

    return NextResponse.json(updatedArticle)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error rejecting article:", error)
    return NextResponse.json(
      { error: "Failed to reject article" },
      { status: 500 }
    )
  }
}

