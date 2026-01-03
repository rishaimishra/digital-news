import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ArticleCard } from "@/components/article/ArticleCard"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const featuredArticles = await prisma.newsArticle.findMany({
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
      media: {
        take: 1,
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 6,
  })

  const categories = await prisma.category.findMany({
    take: 8,
    orderBy: {
      name: "asc",
    },
  })

  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-10">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">Digital News Platform</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Your trusted source for regional news
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/news">
              <Button size="lg">Browse News</Button>
            </Link>
            <Link href="/epaper">
              <Button size="lg" variant="outline">
                E-Paper
              </Button>
            </Link>
          </div>
        </div>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Latest News</h2>
            <Link href="/news">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {featuredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
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
        </section>

        {categories.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/news?categoryId=${category.id}`}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <h3 className="font-semibold">{category.name}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
