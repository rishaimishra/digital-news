import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default async function AdminAdsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/")
  }

  const ads = await prisma.advertisement.findMany({
    include: {
      category: true,
      city: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Advertisement Management</h1>
        <Link href="/admin/ads/new">
          <Button>Create New Advertisement</Button>
        </Link>
      </div>

      {ads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No advertisements yet.</p>
          <Link href="/admin/ads/new">
            <Button>Create your first advertisement</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <Card key={ad.id}>
              <div className="relative h-48 bg-gray-200 overflow-hidden rounded-t-lg">
                <Image
                  src={ad.imageUrl}
                  alt={ad.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{ad.title}</CardTitle>
                {ad.isSponsored && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Sponsored
                  </span>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {ad.category?.name || "All Categories"} - {ad.city?.name || "All Cities"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Status: {ad.status}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

