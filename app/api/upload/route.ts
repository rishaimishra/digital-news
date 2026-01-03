import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { saveUploadedFile } from "@/lib/upload"
import { prisma } from "@/lib/prisma"
import { MediaType } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const articleId = formData.get("articleId") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Save file
    const savedFile = await saveUploadedFile(file)

    // Determine media type
    const mediaType = savedFile.mimeType.startsWith("image/")
      ? MediaType.IMAGE
      : MediaType.VIDEO

    // If articleId is provided, create media record
    if (articleId) {
      // Verify article exists and user has permission
      const article = await prisma.newsArticle.findUnique({
        where: { id: articleId },
      })

      if (!article) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        )
      }

      if (article.authorId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }

      const media = await prisma.media.create({
        data: {
          filename: savedFile.filename,
          originalName: file.name,
          mimeType: savedFile.mimeType,
          size: savedFile.size,
          url: savedFile.url,
          type: mediaType,
          articleId,
        },
      })

      return NextResponse.json(media)
    }

    // Return file info without creating media record
    return NextResponse.json({
      filename: savedFile.filename,
      url: savedFile.url,
      size: savedFile.size,
      mimeType: savedFile.mimeType,
      type: mediaType,
    })
  } catch (error: any) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    )
  }
}

