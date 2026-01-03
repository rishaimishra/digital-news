import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { NextRequest } from "next/server"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"]

export async function saveUploadedFile(
  file: File,
  subdirectory: string = "media"
): Promise<{ filename: string; path: string; url: string; size: number; mimeType: string }> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Validate file size
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  // Validate file type
  const mimeType = file.type
  const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType)
  const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType)

  if (!isImage && !isVideo) {
    throw new Error("Invalid file type. Only images and videos are allowed.")
  }

  // Generate unique filename
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = file.name.split(".").pop()
  const filename = `${timestamp}-${randomString}.${extension}`

  // Create directory if it doesn't exist
  const uploadPath = join(UPLOAD_DIR, subdirectory)
  await mkdir(uploadPath, { recursive: true })

  // Save file
  const filepath = join(uploadPath, filename)
  await writeFile(filepath, buffer)

  // Generate URL
  const url = `/uploads/${subdirectory}/${filename}`

  return {
    filename,
    path: filepath,
    url,
    size: buffer.length,
    mimeType,
  }
}

export function validateFileType(file: File): boolean {
  const mimeType = file.type
  return ALLOWED_IMAGE_TYPES.includes(mimeType) || ALLOWED_VIDEO_TYPES.includes(mimeType)
}

export function validateFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE
}

