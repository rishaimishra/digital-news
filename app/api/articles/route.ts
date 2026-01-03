import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/utils/articles"
import { z } from "zod"

const articleSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  categoryId: z.string().optional(),
  cityId: z.string().optional(),
  language: z.string().default("en"),
  tagIds: z.array(z.string()).optional().default([]),
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const categoryId = searchParams.get("categoryId")
    const cityId = searchParams.get("cityId")
    const authorId = searchParams.get("authorId")
    const published = searchParams.get("published") === "true"

    const where: any = {}

    if (status) {
      where.status = status
    }
    if (categoryId) {
      where.categoryId = categoryId
    }
    if (cityId) {
      where.cityId = cityId
    }
    if (authorId) {
      where.authorId = authorId
    }
    if (published) {
      where.status = "PUBLISHED"
      where.publishedAt = { not: null }
    }

    const articles = await prisma.newsArticle.findMany({
      where,
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
        _count: {
          select: {
            media: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = articleSchema.parse(body)

    // Generate slug
    const baseSlug = generateSlug(validatedData.title)
    let slug = baseSlug
    let counter = 1

    // Ensure unique slug
    while (await prisma.newsArticle.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create article
    const article = await prisma.newsArticle.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        slug,
        status: "DRAFT",
        language: validatedData.language,
        authorId: session.user.id,
        categoryId: validatedData.categoryId || null,
        cityId: validatedData.cityId || null,
        tags: validatedData.tagIds
          ? {
              connect: validatedData.tagIds.map((id) => ({ id })),
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
      },
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating article:", error)
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    )
  }
}

