# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: POS System (or any name you prefer)
   - Database Password: (choose a strong password)
   - Region: (choose closest to you)
5. Click "Create new project"
6. Wait for project to be created (takes 1-2 minutes)

## Step 2: Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" → "anon public")

## Step 3: Create Environment File

1. In the project root, create a file named `.env`
2. Add the following content:

```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Replace `your_project_url_here` with your Project URL
4. Replace `your_anon_key_here` with your anon public key

**Example:**
```
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzIwMCwiZXhwIjoxOTU0NTQzMjAwfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

## Step 4: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire content from `supabase-schema.sql` file
4. Paste it into the SQL Editor
5. Click "Run" or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)
6. Wait for all tables to be created

## Step 5: Verify Tables

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - `items`
   - `stock_purchases`
   - `stock_returns`
   - `sales`
   - `sale_returns`
   - `users`

## Step 6: Restart Development Server

1. Stop your current development server (if running)
2. Run `npm run dev` again
3. The app will now use Supabase for data storage

## Important Notes

- **Data Migration**: If you have existing data in localStorage, you'll need to manually migrate it or it will be lost when you switch to Supabase
- **Backup**: Supabase automatically backs up your data
- **Security**: The anon key is safe to use in frontend code, but never expose your service role key
- **Fallback**: If Supabase is not configured, the app will automatically fall back to localStorage

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env` file exists in the project root
- Make sure variable names start with `VITE_`
- Restart the development server after creating/updating `.env`

### "Error fetching items" or similar errors
- Check your Supabase project is active
- Verify your credentials in `.env` are correct
- Check browser console for detailed error messages
- Make sure all tables are created in Supabase

### Data not syncing
- Check your internet connection
- Verify Supabase project is not paused
- Check browser console for errors

