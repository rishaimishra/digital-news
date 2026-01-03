"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface ArticleActionsProps {
  articleId: string
}

export default function ArticleActions({ articleId }: ArticleActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/articles/${articleId}/approve`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to approve article")
      }

      router.refresh()
    } catch (error) {
      console.error("Error approving article:", error)
      alert("Failed to approve article")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this article?")) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/articles/${articleId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: "" }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject article")
      }

      router.refresh()
    } catch (error) {
      console.error("Error rejecting article:", error)
      alert("Failed to reject article")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleApprove}
        disabled={isLoading}
        variant="default"
        size="sm"
      >
        Approve
      </Button>
      <Button
        onClick={handleReject}
        disabled={isLoading}
        variant="destructive"
        size="sm"
      >
        Reject
      </Button>
    </div>
  )
}

