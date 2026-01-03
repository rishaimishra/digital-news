import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ArticleCard } from "@/components/article/ArticleCard"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import ArticleActions from "@/components/article/ArticleActions"

export default async function EditorArticlesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  if (
    session.user.role !== UserRole.EDITOR &&
    session.user.role !== UserRole.ADMIN
  ) {
    redirect("/")
  }

  const submittedArticles = await prisma.newsArticle.findMany({
    where: {
      status: "SUBMITTED",
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

  const approvedArticles = await prisma.newsArticle.findMany({
    where: {
      status: "APPROVED",
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
    take: 10,
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Editor Dashboard</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Submitted Articles</h2>
          {submittedArticles.length === 0 ? (
            <p className="text-muted-foreground">No articles awaiting review.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submittedArticles.map((article) => (
                <div key={article.id} className="relative">
                  <ArticleCard
                    id={article.id}
                    title={article.title}
                    slug={article.slug}
                    status={article.status}
                    createdAt={article.createdAt}
                    author={article.author}
                    category={article.category || undefined}
                    city={article.city || undefined}
                    featuredImage={article.media[0]?.url}
                    isLink={false}
                  />
                  <div className="mt-4">
                    <ArticleActions articleId={article.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Recently Approved</h2>
          {approvedArticles.length === 0 ? (
            <p className="text-muted-foreground">No approved articles.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedArticles.map((article) => (
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
      </div>
    </div>
  )
}

