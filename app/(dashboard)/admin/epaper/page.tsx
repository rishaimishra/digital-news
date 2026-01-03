import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

export default async function AdminEPaperPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/")
  }

  const epapers = await prisma.ePaper.findMany({
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">E-Paper Management</h1>
        <Link href="/admin/epaper/upload">
          <Button>Upload New E-Paper</Button>
        </Link>
      </div>

      {epapers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No e-papers uploaded yet.</p>
          <Link href="/admin/epaper/upload">
            <Button>Upload your first e-paper</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {epapers.map((epaper) => (
            <div
              key={epaper.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">
                  {format(new Date(epaper.date), "MMMM d, yyyy")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {epaper.city?.name || "All Cities"} - {epaper.language.toUpperCase()} - {epaper.pageCount} pages
                </p>
              </div>
              <Link href={`/epaper/${epaper.id}`}>
                <Button variant="outline">View</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

