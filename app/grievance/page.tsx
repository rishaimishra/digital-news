"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function GrievancePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    articleId: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!formData.subject || !formData.description) {
      setError("Subject and description are required")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/grievances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: formData.subject,
          description: formData.description,
          articleId: formData.articleId || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit grievance")
      }

      setSuccess(true)
      setFormData({ subject: "", description: "", articleId: "" })
    } catch (err: any) {
      setError(err.message || "Failed to submit grievance")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Grievance Submitted</CardTitle>
            <CardDescription>
              Your grievance has been submitted successfully. We will review it
              and respond as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setSuccess(false)} variant="outline">
              Submit Another
            </Button>
            <Button onClick={() => router.push("/")}>Go Home</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Grievance Redressal</CardTitle>
          <CardDescription>
            Please fill out the form below to submit a grievance. We are
            committed to addressing all complaints in accordance with applicable
            regulations.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={6}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="articleId">
                Article ID (Optional - if related to a specific article)
              </Label>
              <Input
                id="articleId"
                value={formData.articleId}
                onChange={(e) =>
                  setFormData({ ...formData, articleId: e.target.value })
                }
                disabled={isLoading}
                placeholder="Enter article ID if applicable"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Grievance"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

