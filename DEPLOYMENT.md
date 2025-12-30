# 🚀 Deployment Guide

This guide will help you deploy the POS System to various hosting platforms.

## Prerequisites

- ✅ Code pushed to GitHub/GitLab/Bitbucket
- ✅ Supabase project created and configured
- ✅ Database setup completed (run `setup-database.sql`)
- ✅ Environment variables ready

## Deploy to Vercel (Recommended)

Vercel offers zero-config deployment for Vite projects.

### Steps:

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your repository
   - Vercel will auto-detect Vite configuration

3. **Configure Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add:
     - `VITE_SUPABASE_URL` = Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
   - Apply to: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

### Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Follow DNS configuration instructions

## Deploy to Netlify

### Steps:

1. **Build locally** (optional, Netlify can build for you)
   ```bash
   npm run build
   ```

2. **Deploy via Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Configure:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy site"

3. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

## Deploy to GitHub Pages

### Steps:

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/pos-system"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Select source: `gh-pages` branch
   - Save

**Note:** GitHub Pages doesn't support environment variables directly. You'll need to use a different approach or use Netlify/Vercel.

## Deploy to Cloudflare Pages

### Steps:

1. **Push to Git**
   ```bash
   git push origin main
   ```

2. **Connect to Cloudflare**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to Pages
   - Click "Create a project"
   - Connect your Git repository

3. **Configure Build**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`

4. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

5. **Deploy**
   - Click "Save and Deploy"
   - Your app will be live

## Deploy to AWS Amplify

### Steps:

1. **Push to Git**
   ```bash
   git push origin main
   ```

2. **Connect to AWS Amplify**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Click "New app" → "Host web app"
   - Connect your Git repository

3. **Configure Build**
   - Build settings will be auto-detected
   - Or use custom:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm install
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: dist
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
     ```

4. **Add Environment Variables**
   - Go to App settings → Environment variables
   - Add your Supabase credentials

5. **Deploy**
   - Click "Save and deploy"
   - Wait for deployment

## Environment Variables

For all platforms, you need these environment variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Where to get these:
1. Go to your Supabase project
2. Navigate to Settings → API
3. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - anon/public key → `VITE_SUPABASE_ANON_KEY`

## Post-Deployment Checklist

- [ ] Database setup completed (`setup-database.sql` run)
- [ ] Environment variables configured
- [ ] App loads without errors
- [ ] Login works with default credentials
- [ ] Can create items
- [ ] Can process sales
- [ ] Stock calculations work correctly
- [ ] RLS policies are active (check Supabase dashboard)

## Troubleshooting Deployment

### Build Fails
- Check Node.js version (v16+ required)
- Verify all dependencies in `package.json`
- Check build logs for specific errors

### Environment Variables Not Working
- Verify variable names start with `VITE_`
- Check variable values are correct
- Restart deployment after adding variables

### App Shows Blank Page
- Check browser console for errors
- Verify Supabase credentials are correct
- Check network tab for API errors
- Ensure RLS policies are configured

### Database Connection Issues
- Verify Supabase project is active
- Check environment variables are set correctly
- Ensure database setup script ran successfully

## Support

If you encounter issues:
1. Check the main README.md troubleshooting section
2. Review deployment platform logs
3. Check Supabase dashboard for database issues
4. Open an issue on GitHub

---

Happy Deploying! 🚀

