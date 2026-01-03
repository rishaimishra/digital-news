import { PrismaClient, UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@digitalnews.com"
  const password = process.env.ADMIN_PASSWORD || "admin123"
  const name = process.env.ADMIN_NAME || "Admin User"

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    console.log(`Admin user with email ${email} already exists.`)
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: UserRole.ADMIN,
    },
  })

  console.log(`✅ Admin user created successfully!`)
  console.log(`Email: ${admin.email}`)
  console.log(`Name: ${admin.name}`)
  console.log(`Role: ${admin.role}`)
  console.log(`\n⚠️  Please change the default password after first login!`)
}

main()
  .catch((e) => {
    console.error("Error creating admin user:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

