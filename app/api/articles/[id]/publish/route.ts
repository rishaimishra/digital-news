import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const article = await prisma.newsArticle.findUnique({
      where: { id: id },
    })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    if (article.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Article must be approved before publishing" },
        { status: 400 }
      )
    }

    const updatedArticle = await prisma.newsArticle.update({
      where: { id: id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
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
        media: true,
      },
    })

    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error("Error publishing article:", error)
    return NextResponse.json(
      { error: "Failed to publish article" },
      { status: 500 }
    )
  }
}

