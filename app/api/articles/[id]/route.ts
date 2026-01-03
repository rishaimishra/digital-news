import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils/articles"
import { UserRole } from "@prisma/client"
import { z } from "zod"

const updateArticleSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  categoryId: z.string().nullable().optional(),
  cityId: z.string().nullable().optional(),
  language: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.newsArticle.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
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

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const article = await prisma.newsArticle.findUnique({
      where: { id: params.id },
    })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Check permissions: author or admin/editor
    const canEdit =
      article.authorId === session.user.id ||
      session.user.role === UserRole.ADMIN ||
      session.user.role === UserRole.EDITOR

    if (!canEdit) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateArticleSchema.parse(body)

    const updateData: any = { ...validatedData }
    delete updateData.tagIds

    // Handle slug if title changed
    if (validatedData.title && validatedData.title !== article.title) {
      const baseSlug = generateSlug(validatedData.title)
      let slug = baseSlug
      let counter = 1

      while (
        await prisma.newsArticle.findFirst({
          where: { slug, NOT: { id: params.id } },
        })
      ) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
      updateData.slug = slug
    }

    // Update article
    const updatedArticle = await prisma.newsArticle.update({
      where: { id: params.id },
      data: {
        ...updateData,
        tags: validatedData.tagIds
          ? {
              set: validatedData.tagIds.map((id) => ({ id })),
            }
          : undefined,
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
        media: true,
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

    console.error("Error updating article:", error)
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const article = await prisma.newsArticle.findUnique({
      where: { id: params.id },
    })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Check permissions: author or admin/editor
    const canDelete =
      article.authorId === session.user.id ||
      session.user.role === UserRole.ADMIN ||
      session.user.role === UserRole.EDITOR

    if (!canDelete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.newsArticle.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Article deleted successfully" })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    )
  }
}

