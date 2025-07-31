# BrewQuest Chronicles Deployment Guide
## Deploy to hopharrison.com using Vercel

### Prerequisites
1. ✅ **Domain**: www.hopharrison.com (owned)
2. ✅ **Code**: Ready with foundation stories and images
3. ✅ **Database**: Supabase configured with 7-beer structure
4. ⚠️ **Hosting**: Need Vercel account (free tier available)

---

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub, GitLab, or email
3. Choose the free "Hobby" plan

### Step 2: Connect Domain
1. In Vercel dashboard, go to **Domains**
2. Add `hopharrison.com` and `www.hopharrison.com`
3. Vercel will provide DNS records to configure with your domain registrar:
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   
   Type: CNAME  
   Name: www
   Value: cname.vercel-dns.com
   ```

### Step 3: Deploy Project
1. **Option A: GitHub Integration (Recommended)**
   - Create GitHub repository for your project
   - Push code to GitHub: 
     ```bash
     git add .
     git commit -m "Ready for deployment"
     git push origin main
     ```
   - In Vercel, click "New Project" → "Import Git Repository"
   - Select your repo and click "Deploy"

2. **Option B: Direct Upload**
   - In Vercel dashboard, click "New Project"
   - Choose "Browse Files" and upload your project folder
   - Vercel will auto-detect Next.js and configure build settings

### Step 4: Environment Variables
In Vercel project settings, add these environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login and Deploy
```bash
# Login to Vercel
vercel login

# Deploy (from project directory)
cd /Users/martingeijer/Desktop/Code/brewquest-blog
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: brewquest-blog
# - Directory: ./
# - Override settings? No
```

### Step 3: Configure Domain
```bash
# Add your domain
vercel domains add hopharrison.com
vercel domains add www.hopharrison.com

# Link domain to project
vercel domains ls
vercel --prod
```

---

## Option 3: Alternative Hosting Platforms

### Netlify
1. Connect GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables

### Traditional Hosting (cPanel)
1. Build project locally: `npm run build`
2. Upload `.next` folder contents to public_html
3. Configure Node.js app in cPanel
4. Set environment variables

---

## Post-Deployment Checklist

### ✅ Site Functionality
- [ ] Homepage loads with foundation stories
- [ ] Individual story pages work (`/stories/american-beer-renaissance`)
- [ ] Images display correctly
- [ ] Navigation works
- [ ] Mobile responsive

### ✅ Domain Configuration
- [ ] `hopharrison.com` redirects to `www.hopharrison.com`
- [ ] SSL certificate active (https://)
- [ ] DNS propagation complete (24-48 hours)

### ✅ Performance
- [ ] Page load times < 3 seconds
- [ ] Images optimized
- [ ] CDN active (Vercel auto-provides)

### ✅ SEO Setup
- [ ] Google Search Console connected
- [ ] Sitemap submitted
- [ ] Meta tags working
- [ ] Social media previews working

---

## Troubleshooting

### Build Errors
If deployment fails, check:
1. **TypeScript errors**: Run `npm run build` locally first
2. **Missing dependencies**: Ensure all imports are installed
3. **Environment variables**: Double-check Supabase credentials

### Domain Issues
1. **DNS not propagating**: Wait 24-48 hours after DNS changes
2. **SSL certificate**: Vercel auto-provides, may take a few minutes
3. **Redirect loops**: Ensure only one redirect rule active

### Image Issues
1. **Images not loading**: Check file paths in `/public/images/`
2. **Large file sizes**: Consider optimizing images
3. **Missing images**: Ensure all referenced images exist

---

## Current Site Status

### ✅ Ready for Deployment
- Foundation stories created and populated
- 5 story images integrated
- Social media posts ready (Instagram, LinkedIn, Twitter, Facebook)
- Database schema complete
- Responsive design implemented

### 🚀 Next Steps After Deployment
1. Test all functionality on live site
2. Submit sitemap to Google
3. Set up Google Analytics
4. Begin social media posting schedule
5. Prepare Alabama Week 1 content

---

## Support

If you need help with deployment:
1. **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
2. **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
3. **Domain Configuration**: Check with your domain registrar's support

The site is ready to go live! 🍺