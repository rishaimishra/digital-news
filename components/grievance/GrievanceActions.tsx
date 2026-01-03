"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface GrievanceActionsProps {
  grievanceId: string
}

export default function GrievanceActions({
  grievanceId,
}: GrievanceActionsProps) {
  const router = useRouter()
  const [isResolving, setIsResolving] = useState(false)
  const [resolution, setResolution] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleResolve = async () => {
    if (!resolution.trim()) {
      alert("Please provide a resolution")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/grievances/${grievanceId}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resolution }),
      })

      if (!response.ok) {
        throw new Error("Failed to resolve grievance")
      }

      router.refresh()
    } catch (error) {
      console.error("Error resolving grievance:", error)
      alert("Failed to resolve grievance")
    } finally {
      setIsLoading(false)
      setIsResolving(false)
      setResolution("")
    }
  }

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this grievance?")) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/grievances/${grievanceId}/reject`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to reject grievance")
      }

      router.refresh()
    } catch (error) {
      console.error("Error rejecting grievance:", error)
      alert("Failed to reject grievance")
    } finally {
      setIsLoading(false)
    }
  }

  if (isResolving) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resolution">Resolution</Label>
          <Textarea
            id="resolution"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            rows={4}
            disabled={isLoading}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleResolve} disabled={isLoading}>
            Submit Resolution
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsResolving(false)
              setResolution("")
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => setIsResolving(true)}
        disabled={isLoading}
        variant="default"
      >
        Resolve
      </Button>
      <Button
        onClick={handleReject}
        disabled={isLoading}
        variant="destructive"
      >
        Reject
      </Button>
    </div>
  )
}

