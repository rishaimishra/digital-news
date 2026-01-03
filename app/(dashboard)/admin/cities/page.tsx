import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminCitiesPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/")
  }

  const cities = await prisma.city.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cities Management</h1>
        <Link href="/admin/cities/new">
          <Button>Create New City</Button>
        </Link>
      </div>

      {cities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No cities yet.</p>
          <Link href="/admin/cities/new">
            <Button>Create your first city</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <Card key={city.id}>
              <CardHeader>
                <CardTitle>{city.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Slug: {city.slug}
                </p>
                {city.state && (
                  <p className="text-sm text-muted-foreground">
                    State: {city.state}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <Link href={`/admin/cities/${city.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

