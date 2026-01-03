"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface City {
  id: string
  name: string
}

export default function UploadEPaperPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    cityId: "",
    language: "en",
  })
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [cities, setCities] = useState<City[]>([])

  // Fetch cities on mount
  useEffect(() => {
    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!file) {
      setError("Please select a PDF file")
      return
    }

    setIsLoading(true)

    try {
      // For now, we'll just upload the file
      // In a production system, you'd process the PDF and extract pages
      const formDataToSend = new FormData()
      formDataToSend.append("file", file)
      formDataToSend.append("date", formData.date)
      if (formData.cityId) {
        formDataToSend.append("cityId", formData.cityId)
      }
      formDataToSend.append("language", formData.language)

      const response = await fetch("/api/epaper/upload", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload e-paper")
      }

      router.push("/admin/epaper")
    } catch (err: any) {
      setError(err.message || "Failed to upload e-paper")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Upload E-Paper</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City (Optional)</Label>
          <Select
            value={formData.cityId}
            onValueChange={(value) =>
              setFormData({ ...formData, cityId: value })
            }
            disabled={isLoading}
          >
            <SelectTrigger id="city">
              <SelectValue placeholder="Select city (optional)" />
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

        <div className="space-y-2">
          <Label htmlFor="file">PDF File</Label>
          <Input
            id="file"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            disabled={isLoading}
          />
          <p className="text-sm text-muted-foreground">
            Upload a PDF file of the e-paper
          </p>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload E-Paper"}
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
    </div>
  )
}

