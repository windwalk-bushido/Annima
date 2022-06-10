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
- Dashboard (stats & search)
- Settings (edit password and/or email) (TBM)
- 404 (TBM)

### To do (Priorities)

- Protect Dashboard and Settings routes
- Change function and variable names if needed

- USERS NEED TO BE ABLE TO SELECT YEAR IN EVENT's DATE
- Save user inputs on Login/Register/F.Password pages (before unmounting them) in sessionStorage (load them when mounting the pages)
- Dashboard should check if the user's '7 day' period is over, then redirect it to "Login" page
- Login and Register pages should trigger "navbar switch" on some other lifecycle hooks (it's not 'mount')
- FIX SUPABASE POLICIES
- Make Settings page
- Implement ES6 stuff like Try Catch, Arrow functions, etc. (if needed)

### To do (General)

- Make 'Forgot password' page
- "Check" icons should be displayed when inputted data is good (All pages)
- Add captcha on Login/Register
- Notifications should be displayed in toasts (Dashboard & Settings)
- All buttons should be centered
- Make images for types of events
- Center (and make it) 'Loading' modal on Dashboard page;
- Make Modal as a component with slot [?]
- Make 404 page

### Milestones

- Switch to TypeScript
- Increase performance (reduce variable number)
- Use Pinia?
- Switch to TailwindCSS
- Write Vitest test's
- Write Cypress test's

### Final goal

- PWA
