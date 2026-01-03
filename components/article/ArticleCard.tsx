import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/workflow/StatusBadge"
import { ArticleStatus } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"

interface ArticleCardProps {
  id: string
  title: string
  slug: string
  status: ArticleStatus
  createdAt: Date
  author?: {
    name: string
  }
  category?: {
    name: string
  }
  city?: {
    name: string
  }
  featuredImage?: string
  isLink?: boolean
}

export function ArticleCard({
  id,
  title,
  slug,
  status,
  createdAt,
  author,
  category,
  city,
  featuredImage,
  isLink = true,
}: ArticleCardProps) {
  const content = (
    <Card className="h-full flex flex-col">
      {featuredImage && (
        <div className="w-full h-48 bg-gray-200 overflow-hidden rounded-t-lg">
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-1 text-sm text-muted-foreground">
          {author && <div>By {author.name}</div>}
          {category && <div>Category: {category.name}</div>}
          {city && <div>City: {city.name}</div>}
          <div>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</div>
        </div>
      </CardContent>
      {isLink && (
        <CardFooter>
          <Link
            href={`/articles/${slug}`}
            className="text-primary hover:underline text-sm font-medium"
          >
            Read more →
          </Link>
        </CardFooter>
      )}
    </Card>
  )

  if (isLink) {
    return <Link href={`/articles/${slug}`}>{content}</Link>
  }

  return content
}

