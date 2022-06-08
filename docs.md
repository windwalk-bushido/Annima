Dev's docs for planning and developing the Annima.

# MVP

- Register/Login/Logout
- CRUD Anniversaries

## Pages

- Homepage
- About
- Register
- Login
- Forgot Password
- Dashboard (stats & search, CRUD)
- Settings (edit password and/or email)
- 404

### TODO

- "Check" icons should be displayed when inputted data is good (Register page)
- Navbar should overlap content, not push it down the page
- Add captcha on Login/Register
- Make 'Forgot password' page
- Add policies on Supabase for updating and deleting the events
- Notifications should be displayed in toasts (Dashboard & Settings)
- All buttons should be centered
- Routes should be protected
  - Dashboard page: not available if user is NOT logged in -> Redirect to: Register page
  - Settings page: not available if user is NOT logged in -> Redirect to: Register page
- Make images for types of events
- Save user inputs on Login/Register/F.Password pages (before unmounting them) in sessionStorage (load them when mounting the pages)
- Login and Register pages should trigger "navbar switch" on some other lifecycle hooks (it's not 'mount')

### Milestones

- Use Pinia
- Switch to Composition API
- Switch to TypeScript
- Increase performance (reduce variable number)
- Write Vitest test's
- Write Cypress test's
