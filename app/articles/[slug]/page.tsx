import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import Image from "next/image"

export default async function ArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const article = await prisma.newsArticle.findUnique({
    where: { slug: params.slug },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      category: true,
      city: true,
      tags: true,
      media: true,
    },
  })

  if (!article || article.status !== "PUBLISHED") {
    notFound()
  }

  const featuredImage = article.media.find((m) => m.type === "IMAGE")

  return (
    <article className="container mx-auto py-8 max-w-4xl">
      <header className="mb-8">
        {featuredImage && (
          <div className="mb-6 aspect-video relative w-full bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={featuredImage.url}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          {article.author && (
            <div>
              <span className="font-medium">By:</span> {article.author.name}
            </div>
          )}
          {article.publishedAt && (
            <div>
              {format(new Date(article.publishedAt), "MMMM d, yyyy")}
            </div>
          )}
          {article.category && (
            <div>
              <span className="font-medium">Category:</span> {article.category.name}
            </div>
          )}
          {article.city && (
            <div>
              <span className="font-medium">City:</span> {article.city.name}
            </div>
          )}
        </div>

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {article.media.length > (featuredImage ? 1 : 0) && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {article.media
              .filter((m) => !featuredImage || m.id !== featuredImage.id)
              .map((media) => (
                <div key={media.id} className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  {media.type === "IMAGE" ? (
                    <Image
                      src={media.url}
                      alt={media.originalName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <video
                      src={media.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
          </div>
        </section>
      )}
    </article>
  )
}

