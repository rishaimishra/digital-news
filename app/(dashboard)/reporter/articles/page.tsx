import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/components/article/ArticleCard"
import { prisma } from "@/lib/prisma"

export default async function ReporterArticlesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const articles = await prisma.newsArticle.findMany({
    where: {
      authorId: session.user.id,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      category: true,
      city: true,
      media: {
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Articles</h1>
        <Link href="/reporter/articles/new">
          <Button>Create New Article</Button>
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No articles yet.</p>
          <Link href="/reporter/articles/new">
            <Button>Create your first article</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              slug={article.slug}
              status={article.status}
              createdAt={article.createdAt}
              author={article.author}
              category={article.category || undefined}
              city={article.city || undefined}
              featuredImage={article.media[0]?.url}
            />
          ))}
        </div>
      )}
    </div>
  )
}

