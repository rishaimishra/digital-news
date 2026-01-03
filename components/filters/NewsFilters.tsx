"use client"

import { useRouter, useSearchParams } from "next/navigation"
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

interface NewsFiltersProps {
  categories: Category[]
  cities: City[]
  currentCategoryId?: string
  currentCityId?: string
  currentLanguage?: string
}

export default function NewsFilters({
  categories,
  cities,
  currentCategoryId,
  currentCityId,
  currentLanguage,
}: NewsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page") // Reset to first page
    router.push(`/news?${params.toString()}`)
  }

  return (
    <div className="mb-6 flex gap-4 flex-wrap">
      <Select
        value={currentCategoryId || ""}
        onValueChange={(value) => updateFilter("categoryId", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentCityId || ""}
        onValueChange={(value) => updateFilter("cityId", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Cities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Cities</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city.id} value={city.id}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentLanguage || "en"}
        onValueChange={(value) => updateFilter("language", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Language" />
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
  )
}

