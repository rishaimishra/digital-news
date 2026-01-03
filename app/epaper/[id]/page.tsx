import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import EPaperViewer from "@/components/epaper/EPaperViewer"

export default async function EPaperPage({
  params,
}: {
  params: { id: string }
}) {
  const epaper = await prisma.ePaper.findUnique({
    where: { id: params.id },
    include: {
      city: true,
      pages: {
        orderBy: {
          pageNumber: "asc",
        },
      },
    },
  })

  if (!epaper || epaper.status !== "PUBLISHED") {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <EPaperViewer epaper={epaper} />
    </div>
  )
}

