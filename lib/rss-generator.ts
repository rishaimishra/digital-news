import { NewsArticle } from "@prisma/client"

export function generateRSSFeed(
  articles: (NewsArticle & {
    author?: { name: string } | null
    category?: { name: string } | null
    city?: { name: string } | null
  })[],
  title: string,
  description: string,
  link: string
): string {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const siteUrl = baseUrl.replace(/\/$/, "")

  const items = articles
    .map((article) => {
      const articleUrl = `${siteUrl}/articles/${article.slug}`
      const pubDate = article.publishedAt
        ? new Date(article.publishedAt).toUTCString()
        : new Date(article.createdAt).toUTCString()

      // Strip HTML tags from content for RSS description
      const content = article.content
        .replace(/<[^>]*>/g, "")
        .substring(0, 300)

      return `
    <item>
      <title><![CDATA[${escapeXML(article.title)}]]></title>
      <link>${articleUrl}</link>
      <guid>${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${escapeXML(content)}...]]></description>
      ${article.author ? `<author>${escapeXML(article.author.name)}</author>` : ""}
      ${article.category ? `<category>${escapeXML(article.category.name)}</category>` : ""}
    </item>
  `
    })
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${escapeXML(title)}]]></title>
    <link>${link}</link>
    <description><![CDATA[${escapeXML(description)}]]></description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${link}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`
}

function escapeXML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

