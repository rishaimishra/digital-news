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
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const article = await prisma.newsArticle.findUnique({
      where: { id: params.id },
    })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Check permissions: author only
    if (article.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updatedArticle = await prisma.newsArticle.update({
      where: { id: params.id },
      data: {
        status: "SUBMITTED",
      },
      include: {
        author: {
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
    console.error("Error submitting article:", error)
    return NextResponse.json(
      { error: "Failed to submit article" },
      { status: 500 }
    )
  }
}

