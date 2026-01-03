import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import EditArticleForm from "@/components/article/EditArticleForm"

export default async function EditArticlePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const article = await prisma.newsArticle.findUnique({
    where: { id: params.id },
    include: {
      tags: true,
    },
  })

  if (!article) {
    redirect("/reporter/articles")
  }

  if (article.authorId !== session.user.id) {
    redirect("/reporter/articles")
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Edit Article</h1>
      <EditArticleForm article={article} />
    </div>
  )
}

