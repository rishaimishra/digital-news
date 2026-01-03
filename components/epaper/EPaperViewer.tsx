"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { EPaper, EPaperPage, City } from "@prisma/client"
import { format } from "date-fns"

interface EPaperViewerProps {
  epaper: EPaper & {
    city: City | null
    pages: EPaperPage[]
  }
}

export default function EPaperViewer({ epaper }: EPaperViewerProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [zoom, setZoom] = useState(100)

  const pages = epaper.pages.length > 0 ? epaper.pages : []
  const hasPages = pages.length > 0

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < pages.length) {
      setCurrentPage(pageIndex)
    }
  }

  const increaseZoom = () => {
    setZoom((prev) => Math.min(prev + 25, 200))
  }

  const decreaseZoom = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const resetZoom = () => {
    setZoom(100)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {format(new Date(epaper.date), "MMMM d, yyyy")}
          </h1>
          <p className="text-muted-foreground">
            {epaper.city?.name || "All Cities"} - {epaper.language.toUpperCase()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={decreaseZoom}>
            -
          </Button>
          <Button variant="outline" onClick={resetZoom}>
            {zoom}%
          </Button>
          <Button variant="outline" onClick={increaseZoom}>
            +
          </Button>
        </div>
      </div>

      {hasPages ? (
        <>
          <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg min-h-[600px] overflow-auto">
            <img
              src={pages[currentPage]?.imageUrl}
              alt={`Page ${pages[currentPage]?.pageNumber}`}
              style={{ maxWidth: `${zoom}%`, height: "auto" }}
              className="shadow-lg"
            />
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {pages.length}
            </span>
            <Button
              variant="outline"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === pages.length - 1}
            >
              Next
            </Button>
          </div>

          {epaper.fileUrl && (
            <div className="text-center">
              <a
                href={epaper.fileUrl}
                download
                className="text-primary hover:underline"
              >
                Download PDF
              </a>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          {epaper.fileUrl ? (
            <iframe
              src={epaper.fileUrl}
              className="w-full h-[800px] border rounded-lg"
              title="E-Paper PDF"
            />
          ) : (
            <p className="text-muted-foreground">E-Paper content not available</p>
          )}
        </div>
      )}
    </div>
  )
}

