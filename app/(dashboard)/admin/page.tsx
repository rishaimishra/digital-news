import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/")
  }

  const [
    totalUsers,
    totalArticles,
    pendingArticles,
    approvedArticles,
    totalCategories,
    totalCities,
    totalEPapers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.newsArticle.count(),
    prisma.newsArticle.count({ where: { status: "SUBMITTED" } }),
    prisma.newsArticle.count({ where: { status: "APPROVED" } }),
    prisma.category.count(),
    prisma.city.count(),
    prisma.ePaper.count(),
  ])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalArticles}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingArticles}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Approved Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{approvedArticles}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/users">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage users, roles, and permissions
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/editor/articles">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Review and manage articles
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/ads">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle>Advertisement Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage advertisements and sponsored content
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/epaper">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle>E-Paper Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Upload and manage e-papers
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/grievances">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle>Grievance Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Review and resolve grievances
              </p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              Categories: <strong>{totalCategories}</strong>
            </p>
            <p className="text-sm">
              Cities: <strong>{totalCities}</strong>
            </p>
            <p className="text-sm">
              E-Papers: <strong>{totalEPapers}</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

