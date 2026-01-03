import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "epaper")

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const date = formData.get("date") as string
    const cityId = formData.get("cityId") as string | null
    const language = formData.get("language") as string

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Please upload a PDF file" },
        { status: 400 }
      )
    }

    // Create upload directory
    await mkdir(UPLOAD_DIR, { recursive: true })

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const timestamp = Date.now()
    const filename = `epaper-${timestamp}.pdf`
    const filepath = join(UPLOAD_DIR, filename)
    await writeFile(filepath, buffer)

    const fileUrl = `/uploads/epaper/${filename}`

    // Create e-paper record
    // Note: In production, you'd process the PDF to extract pages
    // For now, we'll create a basic record
    const epaper = await prisma.ePaper.create({
      data: {
        date: new Date(date),
        cityId: cityId || null,
        language: language || "en",
        fileUrl: fileUrl,
        pageCount: 0, // Would be set after PDF processing
        status: "PUBLISHED",
      },
      include: {
        city: true,
      },
    })

    return NextResponse.json(epaper, { status: 201 })
  } catch (error: any) {
    console.error("Error uploading e-paper:", error)
    return NextResponse.json(
      { error: error.message || "Failed to upload e-paper" },
      { status: 500 }
    )
  }
}

