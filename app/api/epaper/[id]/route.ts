import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
  try {
    const epaper = await prisma.ePaper.findUnique({
      where: { id: id },
      include: {
        city: true,
        pages: {
          orderBy: {
            pageNumber: "asc",
          },
        },
      },
    })

    if (!epaper) {
      return NextResponse.json({ error: "E-Paper not found" }, { status: 404 })
    }

    return NextResponse.json(epaper)
  } catch (error) {
    console.error("Error fetching e-paper:", error)
    return NextResponse.json(
      { error: "Failed to fetch e-paper" },
      { status: 500 }
    )
  }
}

