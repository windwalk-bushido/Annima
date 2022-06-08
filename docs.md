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

- "Check" icons should be displayed when inputted data is good (All pages)
- Navbar should overlap content, not push it down the page
- Add captcha on Login/Register
- Make 'Forgot password' page
- Notifications should be displayed in toasts (Dashboard & Settings)
- All buttons should be centered
- Routes should be protected
  - Dashboard page: not available if user is NOT logged in -> Redirect to: Register page
  - Settings page: not available if user is NOT logged in -> Redirect to: Register page
- Make images for types of events
- Save user inputs on Login/Register/F.Password pages (before unmounting them) in sessionStorage (load them when mounting the pages)
- Login and Register pages should trigger "navbar switch" on some other lifecycle hooks (it's not 'mount')
- Register supabase globally
- FIX SUPABASE POLICIES
- Center (and make it) 'Loading' modal on Dashboard page;
- Async the Register form
- Make Modal as a component with slot
- Dashboard should check if the user's '7 day' period is over, then redirect it to "Login" page

### Milestones

- Use Pinia
- Increase performance (reduce variable number)
- Switch to Composition API
- Switch to TypeScript
- Switch to TailwindCSS
- Write Vitest test's
- Write Cypress test's
