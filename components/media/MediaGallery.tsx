"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MediaType } from "@prisma/client"

interface Media {
  id: string
  url: string
  originalName: string
  type: MediaType
}

interface MediaGalleryProps {
  media: Media[]
  onDelete?: (mediaId: string) => void
  deletable?: boolean
}

export function MediaGallery({
  media,
  onDelete,
  deletable = false,
}: MediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)

  const handleDelete = async (mediaId: string) => {
    if (onDelete && confirm("Are you sure you want to delete this media?")) {
      onDelete(mediaId)
    }
  }

  if (media.length === 0) {
    return <p className="text-muted-foreground text-sm">No media uploaded</p>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {media.map((item) => (
          <div key={item.id} className="relative group">
            <div
              className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedMedia(item)}
            >
              {item.type === MediaType.IMAGE ? (
                <Image
                  src={item.url}
                  alt={item.originalName}
                  fill
                  className="object-cover"
                />
              ) : (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {deletable && onDelete && (
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(item.id)
                }}
              >
                Delete
              </Button>
            )}
          </div>
        ))}
      </div>

      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            {selectedMedia.type === MediaType.IMAGE ? (
              <Image
                src={selectedMedia.url}
                alt={selectedMedia.originalName}
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
              />
            ) : (
              <video
                src={selectedMedia.url}
                controls
                className="max-w-full max-h-[90vh]"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setSelectedMedia(null)}
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

