# Admin Credentials

## Default Admin Account

**⚠️ IMPORTANT: Change this password immediately after first login!**

- **Email**: `admin@digitalnews.com`
- **Password**: `admin123`
- **Role**: ADMIN

## Login URL

https://digital-news-phi.vercel.app/login

## Security Notes

1. This is a default account created for initial setup
2. Please change the password immediately
3. Consider creating additional admin accounts with stronger passwords
4. Delete or disable this default account if not needed

## Creating Additional Admins

To create more admin users, you can:

1. **Via Prisma Studio** (recommended for development):
   ```bash
   DATABASE_URL="your_db_url" npx prisma studio
   ```
   Then create a user with role `ADMIN`

2. **Via Script**:
   ```bash
   DATABASE_URL="your_db_url" ADMIN_EMAIL="newadmin@example.com" ADMIN_PASSWORD="securepassword" ADMIN_NAME="Admin Name" npm run create-admin
   ```

3. **Via Database** (advanced):
   Use your database client to insert a user with:
   - Hashed password (use bcrypt with 10 rounds)
   - Role: `ADMIN`

