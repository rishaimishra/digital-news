import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateRSSFeed } from "@/lib/rss-generator"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category: categoryParam } = await params
    // Find category by slug or ID
    const category = await prisma.category.findFirst({
      where: {
        OR: [{ slug: categoryParam }, { id: categoryParam }],
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    const articles = await prisma.newsArticle.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { not: null },
        categoryId: category.id,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        category: true,
        city: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 50,
    })

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const feed = generateRSSFeed(
      articles,
      `${category.name} - Digital News`,
      `Latest news from ${category.name} category`,
      `${baseUrl}/api/rss/category/${category.slug}`
    )

    return new NextResponse(feed, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("Error generating RSS feed:", error)
    return NextResponse.json(
      { error: "Failed to generate RSS feed" },
      { status: 500 }
    )
  }
}

