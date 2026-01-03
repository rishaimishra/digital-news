"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"

interface MediaUploadProps {
  articleId?: string
  onUploadComplete?: (media: any) => void
  multiple?: boolean
}

export function MediaUpload({
  articleId,
  onUploadComplete,
  multiple = false,
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError("")
      setUploading(true)

      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const formData = new FormData()
          formData.append("file", file)
          if (articleId) {
            formData.append("articleId", articleId)
          }

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Upload failed")
          }

          const media = await response.json()
          if (onUploadComplete) {
            onUploadComplete(media)
          }
          return media
        })

        await Promise.all(uploadPromises)
      } catch (err: any) {
        setError(err.message || "Failed to upload files")
      } finally {
        setUploading(false)
      }
    },
    [articleId, onUploadComplete]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
      "video/*": [".mp4", ".webm", ".mov"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400"
        } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} disabled={uploading} />
        <p className="text-sm text-muted-foreground">
          {isDragActive
            ? "Drop the files here..."
            : "Drag & drop files here, or click to select"}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Images (JPEG, PNG, WebP, GIF) and Videos (MP4, WebM, MOV) up to 10MB
        </p>
      </div>
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}
      {uploading && (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      )}
    </div>
  )
}

