# Middleware Fix - Redirect Loop After Login

## Issue
After logging in with admin credentials, accessing `/admin` redirects back to login page, creating a redirect loop.

## Root Cause
The middleware uses `getToken()` from `next-auth/jwt` which may not work correctly with NextAuth v5's credentials provider in the Edge runtime. The token might not be accessible immediately after login, or the cookie structure might be different.

## Solutions Applied

### 1. Updated Login Page
- Added `callbackUrl` handling to redirect users back to the page they were trying to access
- Changed from `router.push()` to `window.location.href` for hard navigation
- This ensures the browser fully reloads and the middleware can see the new session cookie

### 2. Updated Middleware
- Added `callbackUrl` parameter in redirects for better UX
- Middleware now includes the intended path in the login URL

## Testing Steps

1. **Clear browser cookies and cache**
2. **Go to**: https://digital-news-phi.vercel.app/admin (you'll be redirected to login)
3. **Login with admin credentials**:
   - Email: `admin@digitalnews.com`
   - Password: `admin123`
4. **You should be redirected to `/admin`** after successful login

## If Issue Persists

If you still experience the redirect loop, try these steps:

1. **Hard refresh**: Clear browser cache completely (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. **Incognito mode**: Test in a private/incognito window
3. **Check browser console**: Look for any JavaScript errors
4. **Check network tab**: Verify that the session cookie is being set after login

## Alternative Solution (If Needed)

If `getToken()` continues to not work with NextAuth v5, we may need to:
- Remove middleware authentication checks for protected routes
- Handle authentication checks at the page level instead
- Use cookie-based checks in middleware as a workaround

However, this is less secure and not recommended for production.

## Environment Variables Required

Make sure these are set in Vercel:
- ✅ `DATABASE_URL`
- ✅ `NEXTAUTH_URL` (should be `https://digital-news-phi.vercel.app`)
- ✅ `NEXTAUTH_SECRET`
