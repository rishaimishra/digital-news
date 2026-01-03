import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { UserRole } from "@prisma/client"
import { SignOutButton } from "@/components/auth/SignOutButton"

export default async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Digital News
          </Link>

          <nav className="flex items-center gap-4">
            <Link href="/news" className="hover:underline">
              News
            </Link>
            <Link href="/epaper" className="hover:underline">
              E-Paper
            </Link>

            {session?.user ? (
              <>
                {session.user.role === UserRole.REPORTER && (
                  <Link href="/reporter/articles">
                    <Button variant="ghost">My Articles</Button>
                  </Link>
                )}
                {(session.user.role === UserRole.EDITOR ||
                  session.user.role === UserRole.ADMIN) && (
                  <Link href="/editor/articles">
                    <Button variant="ghost">Editor</Button>
                  </Link>
                )}
                {session.user.role === UserRole.ADMIN && (
                  <Link href="/admin">
                    <Button variant="ghost">Admin</Button>
                  </Link>
                )}
                <span className="text-sm text-muted-foreground">
                  {session.user.name}
                </span>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

