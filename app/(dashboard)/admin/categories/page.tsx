import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/")
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories Management</h1>
        <Link href="/admin/categories/new">
          <Button>Create New Category</Button>
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No categories yet.</p>
          <Link href="/admin/categories/new">
            <Button>Create your first category</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Slug: {category.slug}
                </p>
                {category.description && (
                  <p className="text-sm">{category.description}</p>
                )}
                <div className="mt-4 flex gap-2">
                  <Link href={`/admin/categories/${category.id}/edit`}>
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

