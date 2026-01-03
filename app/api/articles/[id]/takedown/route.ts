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

    const article = await prisma.newsArticle.findUnique({
      where: { id: params.id },
    })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Update status to rejected (takedown)
    const updatedArticle = await prisma.newsArticle.update({
      where: { id: params.id },
      data: {
        status: "REJECTED",
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: "Article taken down successfully",
      article: updatedArticle,
    })
  } catch (error) {
    console.error("Error taking down article:", error)
    return NextResponse.json(
      { error: "Failed to take down article" },
      { status: 500 }
    )
  }
}

