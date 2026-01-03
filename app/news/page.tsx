import { ArticleCard } from "@/components/article/ArticleCard"
import { prisma } from "@/lib/prisma"
import NewsFilters from "@/components/filters/NewsFilters"

interface NewsPageProps {
  searchParams: {
    categoryId?: string
    cityId?: string
    language?: string
    page?: string
  }
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const categoryId = searchParams.categoryId
  const cityId = searchParams.cityId
  const language = searchParams.language
  const page = parseInt(searchParams.page || "1")
  const limit = 12
  const offset = (page - 1) * limit

  const where: any = {
    status: "PUBLISHED",
    publishedAt: { not: null },
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

  const [articles, total, categories, cities] = await Promise.all([
    prisma.newsArticle.findMany({
      where,
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
      take: limit,
      skip: offset,
    }),
    prisma.newsArticle.count({ where }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.city.findMany({
      orderBy: { name: "asc" },
    }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">News</h1>

      <NewsFilters
        categories={categories}
        cities={cities}
        currentCategoryId={categoryId}
        currentCityId={cityId}
        currentLanguage={language}
      />

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => {
                  const params = new URLSearchParams(
                    searchParams as any
                  )
                  params.set("page", pageNum.toString())
                  return (
                    <a
                      key={pageNum}
                      href={`/news?${params.toString()}`}
                      className={`px-4 py-2 border rounded ${
                        pageNum === page
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                    >
                      {pageNum}
                    </a>
                  )
                }
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

