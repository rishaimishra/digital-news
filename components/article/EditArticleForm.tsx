"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArticleForm } from "@/components/article/ArticleForm"
import { NewsArticle, Tag } from "@prisma/client"

interface EditArticleFormProps {
  article: NewsArticle & { tags: Tag[] }
}

export default function EditArticleForm({ article }: EditArticleFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: {
    title: string
    content: string
    categoryId: string
    cityId: string
    language: string
  }) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/articles/${article.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update article")
      }

      router.push(`/reporter/articles`)
    } catch (error: any) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ArticleForm
      articleId={article.id}
      initialData={{
        title: article.title,
        content: article.content,
        categoryId: article.categoryId || "",
        cityId: article.cityId || "",
        language: article.language,
      }}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  )
}

