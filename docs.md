Dev's docs for planning and developing the Annima.

# MVP

- Register/Login/Logout
- CRUD Anniversaries

## Pages

TBM = To be made

- Homepage (TBM)
- About (TBM)
- Register
- Login
- Forgot Password (TBM)
- Dashboard (stats & search, CRUD)
- Settings (edit password and/or email) (TBM)
- 404 (TBM)

### To do (Priorities)

- Routes should be protected
  - Dashboard page: not available if user is NOT logged in -> Redirect to: Register page
  - Settings page: not available if user is NOT logged in -> Redirect to: Register page
- Save user inputs on Login/Register/F.Password pages (before unmounting them) in sessionStorage (load them when mounting the pages)
- Dashboard should check if the user's '7 day' period is over, then redirect it to "Login" page
- Login and Register pages should trigger "navbar switch" on some other lifecycle hooks (it's not 'mount')
- FIX SUPABASE POLICIES

### To do (General)

- "Check" icons should be displayed when inputted data is good (All pages)
- Add captcha on Login/Register
- Make 'Forgot password' page
- Notifications should be displayed in toasts (Dashboard & Settings)
- All buttons should be centered
- Make images for types of events
- Center (and make it) 'Loading' modal on Dashboard page;
- Make Modal as a component with slot

### Milestones

- Use Pinia?
- Increase performance (reduce variable number)
- Switch to Composition API
- Switch to TypeScript
- Switch to TailwindCSS
- Write Vitest test's
- Write Cypress test's
