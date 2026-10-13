# Swathi Car Rentals

A premium self-drive car rental platform built with HTML5, CSS3, Vanilla JavaScript, and Supabase.

## Technologies Used
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend & Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Hosting**: Vercel

## Folder Structure
- `/admin` - Admin dashboard pages
- `/css` - Stylesheets
- `/js` - JavaScript files
- `/assets` - Images, icons, and logos
- `/components` - Reusable HTML snippets (Navbar, Footer, Cards)
- `/supabase` - SQL schema, policies, and seed data

## Setup Instructions

### 1. Supabase Setup
1. Create a new Supabase project.
2. Run the SQL scripts in the `supabase/` folder to create tables and policies.
3. Set up two storage buckets:
   - `car-images` (Public)
   - `verification-documents` (Private)

### 2. Environment Variables
1. Copy `.env.example` to `.env`.
2. Add your Supabase URL and Anon Key.
3. Configure the WhatsApp business number.

### 3. Local Development
Since this uses Vanilla JS, you can serve the directory using any local web server.
Using Node/npx:
```bash
npx serve .
```

### 4. Deployment
Deploy to Vercel by linking your GitHub repository. The included `vercel.json` configures routing if needed.
