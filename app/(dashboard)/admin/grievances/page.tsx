import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GrievanceActions from "@/components/grievance/GrievanceActions"

export default async function AdminGrievancesPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/")
  }

  const grievances = await prisma.grievance.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      article: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Grievance Management</h1>

      {grievances.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No grievances submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grievances.map((grievance) => (
            <Card key={grievance.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{grievance.subject}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Submitted by: {grievance.user?.name || "Anonymous"} (
                      {grievance.user?.email})
                    </p>
                    {grievance.article && (
                      <p className="text-sm text-muted-foreground">
                        Related to: {grievance.article.title}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      grievance.status === "RESOLVED"
                        ? "bg-green-100 text-green-800"
                        : grievance.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : grievance.status === "UNDER_REVIEW"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {grievance.status.replace("_", " ")}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 whitespace-pre-wrap">
                  {grievance.description}
                </p>
                {grievance.resolution && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="font-semibold mb-2">Resolution:</p>
                    <p className="whitespace-pre-wrap">
                      {grievance.resolution}
                    </p>
                  </div>
                )}
                <div className="mt-4">
                  <GrievanceActions grievanceId={grievance.id} />
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Submitted: {new Date(grievance.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

