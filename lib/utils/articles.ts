import { ArticleStatus } from "@prisma/client"

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function isValidArticleStatus(status: string): status is ArticleStatus {
  return Object.values(ArticleStatus).includes(status as ArticleStatus)
}

