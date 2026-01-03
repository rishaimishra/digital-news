"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Category {
  id: string
  name: string
}

interface City {
  id: string
  name: string
}

interface ArticleFormData {
  title: string
  content: string
  categoryId: string
  cityId: string
  language: string
}

interface ArticleFormProps {
  articleId?: string
  initialData?: Partial<ArticleFormData>
  onSubmit: (data: ArticleFormData) => Promise<void>
  isLoading?: boolean
}

export function ArticleForm({
  articleId,
  initialData,
  onSubmit,
  isLoading = false,
}: ArticleFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<ArticleFormData>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    categoryId: initialData?.categoryId || "",
    cityId: initialData?.cityId || "",
    language: initialData?.language || "en",
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, citiesRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/cities"),
        ])

        const [categoriesData, citiesData] = await Promise.all([
          categoriesRes.json(),
          citiesRes.json(),
        ])

        setCategories(categoriesData)
        setCities(citiesData)
      } catch (err) {
        console.error("Error fetching form data:", err)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.title || !formData.content) {
      setError("Title and content are required")
      return
    }

    try {
      await onSubmit(formData)
    } catch (err: any) {
      setError(err.message || "Failed to save article")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          required
          rows={15}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) =>
              setFormData({ ...formData, categoryId: value })
            }
            disabled={isLoading}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Select
            value={formData.cityId}
            onValueChange={(value) =>
              setFormData({ ...formData, cityId: value })
            }
            disabled={isLoading}
          >
            <SelectTrigger id="city">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select
          value={formData.language}
          onValueChange={(value) =>
            setFormData({ ...formData, language: value })
          }
          disabled={isLoading}
        >
          <SelectTrigger id="language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="hi">Hindi</SelectItem>
            <SelectItem value="ta">Tamil</SelectItem>
            <SelectItem value="te">Telugu</SelectItem>
            <SelectItem value="ml">Malayalam</SelectItem>
            <SelectItem value="kn">Kannada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : articleId ? "Update Article" : "Create Article"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

