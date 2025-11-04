# Deployment Guide for MoxiePro

This guide will help you deploy MoxiePro to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Git installed on your computer
3. Node.js and npm installed

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. Create a new repository on GitHub named `MoxiePro`
   - Go to https://github.com/new
   - Name: `MoxiePro`
   - Description: "AI-powered Psychology Today profile optimization for therapists"
   - Public or Private (your choice)
   - DO NOT initialize with README (we already have one)

### Step 2: Configure the Project

The project is already configured with the base path `/MoxiePro/`. If you named your repository something different, update these files:

**vite.config.js:**
```javascript
export default defineConfig({
  base: '/YOUR_REPO_NAME/',
  // ...
})
```

**src/main.jsx:**
```javascript
<BrowserRouter basename="/YOUR_REPO_NAME">
```

### Step 3: Push to GitHub

Navigate to the MoxiePro directory and run:

```bash
cd MoxiePro

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: MoxiePro SaaS application"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/MoxiePro.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under "Build and deployment":
   - Source: Select **GitHub Actions**
5. Save

### Step 5: Deploy

The GitHub Actions workflow will automatically run and deploy your site when you push to the main branch.

You can also deploy manually using:

```bash
npm run build
npm run deploy
```

### Step 6: Access Your Site

After deployment completes (usually 2-5 minutes), your site will be available at:

```
https://YOUR_USERNAME.github.io/MoxiePro/
```

## Continuous Deployment

Every time you push to the `main` branch, GitHub Actions will automatically:
1. Install dependencies
2. Build the project
3. Deploy to GitHub Pages

You can monitor deployments:
1. Go to your repository on GitHub
2. Click the **Actions** tab
3. View the latest workflow run

## Troubleshooting

### Blank Page After Deployment

**Problem**: Site loads but shows blank page

**Solutions**:
1. Check browser console for errors
2. Verify `base` path in `vite.config.js` matches your repo name
3. Verify `basename` in `src/main.jsx` matches your repo name
4. Clear browser cache and hard reload (Ctrl+Shift+R)

### 404 Error on Routes

**Problem**: Direct URLs to pages show 404

**Solutions**:
1. This is expected with client-side routing on GitHub Pages
2. Users should navigate from the home page
3. For a fix, you can add a custom 404.html that redirects to index.html

### Build Fails

**Problem**: GitHub Actions workflow fails during build

**Solutions**:
1. Check the Actions tab for error details
2. Ensure all dependencies are listed in package.json
3. Try running `npm run build` locally to identify issues
4. Check Node version compatibility

### Assets Not Loading

**Problem**: Images or CSS not loading

**Solutions**:
1. Verify all asset paths use relative URLs
2. Check `base` configuration in vite.config.js
3. Ensure assets are in the `public` folder or properly imported

## Custom Domain (Optional)

To use a custom domain instead of github.io:

1. Add a file named `CNAME` to the `public` folder:
```
yourdomain.com
```

2. Configure DNS:
   - Add a CNAME record pointing to `YOUR_USERNAME.github.io`
   - Or add A records for GitHub's IP addresses

3. Enable HTTPS in repository Settings → Pages

## Environment Variables

For API keys and secrets:

1. Never commit `.env` files to git (already in .gitignore)
2. For GitHub Pages, use repository secrets:
   - Settings → Secrets and variables → Actions
   - Add secrets that can be used in workflows

3. For build-time variables in Vite:
   - Prefix with `VITE_`
   - Access with `import.meta.env.VITE_YOUR_VAR`

## Updating the Site

To update your deployed site:

```bash
# Make your changes

# Commit changes
git add .
git commit -m "Description of changes"

# Push to GitHub
git push

# Deployment happens automatically!
```

## Monitoring

Monitor your site:
- **Traffic**: Use Google Analytics (add to index.html)
- **Errors**: Use services like Sentry
- **Uptime**: GitHub Pages has 99.9% uptime SLA

## Backup

Always maintain backups:
1. GitHub repository is your primary backup
2. Export repository periodically
3. Keep local copies of important data

## Next Steps

After successful deployment:

1. Test all pages and functionality
2. Check mobile responsiveness
3. Test on different browsers
4. Set up analytics
5. Share your site!

## Support

For issues specific to:
- **GitHub Pages**: https://docs.github.com/pages
- **Vite**: https://vitejs.dev/guide/
- **React Router**: https://reactrouter.com/

---

Need help? Check the main README.md or contact support.
