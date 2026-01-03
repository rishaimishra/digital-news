# Troubleshooting Guide

## Issue: `/admin` page not working

### Common Causes and Solutions:

1. **Not Logged In**
   - Make sure you're logged in first
   - Go to: https://digital-news-phi.vercel.app/login
   - Login with admin credentials:
     - Email: `admin@digitalnews.com`
     - Password: `admin123`

2. **Not Logged In as Admin**
   - The `/admin` route requires ADMIN role
   - If you're logged in as a different user, you'll be redirected to the home page
   - Make sure you're using the admin account

3. **Session/Cookie Issues**
   - Clear your browser cookies and try again
   - Try in an incognito/private window
   - Make sure cookies are enabled

4. **Build/Deployment Issues**
   - Wait a few minutes after deployment for changes to propagate
   - Check Vercel deployment logs for errors
   - Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Quick Checklist:

- [ ] Are you logged in? (Check if you see your name/email in the header)
- [ ] Are you logged in as ADMIN? (Check your user role)
- [ ] Did you clear cookies and try again?
- [ ] Is the deployment successful? (Check Vercel dashboard)
- [ ] Are you accessing the correct URL? (https://digital-news-phi.vercel.app/admin)

### Testing Steps:

1. Go to the login page: https://digital-news-phi.vercel.app/login
2. Login with admin credentials
3. After successful login, you should be redirected (or manually navigate to `/admin`)
4. You should see the Admin Dashboard with statistics and management cards

### If Still Not Working:

Check the browser console (F12) for any JavaScript errors
Check the Network tab to see if requests are failing
Share the specific error message you're seeing

