import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const categoryId = searchParams.get("categoryId")
    const cityId = searchParams.get("cityId")
    const language = searchParams.get("language")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    const where: any = {
      status: "PUBLISHED",
      publishedAt: { not: null },
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ]
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (cityId) {
      where.cityId = cityId
    }

    if (language) {
      where.language = language
    }

    const [articles, total] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
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
          media: {
            take: 1,
          },
        },
        orderBy: {
          publishedAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.newsArticle.count({ where }),
    ])

    return NextResponse.json({
      articles,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error searching articles:", error)
    return NextResponse.json(
      { error: "Failed to search articles" },
      { status: 500 }
    )
  }
}

