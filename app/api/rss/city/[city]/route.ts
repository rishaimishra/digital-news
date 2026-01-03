import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateRSSFeed } from "@/lib/rss-generator"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  try {
    const { city: cityParam } = await params
    // Find city by slug or ID
    const city = await prisma.city.findFirst({
      where: {
        OR: [{ slug: cityParam }, { id: cityParam }],
      },
    })

    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 })
    }

    const articles = await prisma.newsArticle.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { not: null },
        cityId: city.id,
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
      `${city.name} - Digital News`,
      `Latest news from ${city.name}`,
      `${baseUrl}/api/rss/city/${city.slug}`
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

