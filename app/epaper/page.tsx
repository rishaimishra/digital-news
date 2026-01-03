import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function EPaperArchivePage() {
  const epapers = await prisma.ePaper.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      city: true,
    },
    orderBy: {
      date: "desc",
    },
    take: 50,
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">E-Paper Archive</h1>

      {epapers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No e-papers available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {epapers.map((epaper) => (
            <Link key={epaper.id} href={`/epaper/${epaper.id}`}>
              <Card className="hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle>
                    {format(new Date(epaper.date), "MMMM d, yyyy")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {epaper.city?.name || "All Cities"} - {epaper.language.toUpperCase()}
                  </p>
                  {epaper.pageCount > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {epaper.pageCount} pages
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

