"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArticleForm } from "@/components/article/ArticleForm"

export default function NewArticlePage() {
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
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create article")
      }

      const article = await response.json()
      router.push(`/reporter/articles`)
    } catch (error: any) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>
      <ArticleForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}

