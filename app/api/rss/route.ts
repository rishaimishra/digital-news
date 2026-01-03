import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateRSSFeed } from "@/lib/rss-generator"

export async function GET() {
  try {
    const articles = await prisma.newsArticle.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { not: null },
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
      "Digital News - Latest News",
      "Latest news from Digital News Platform",
      `${baseUrl}/api/rss`
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

