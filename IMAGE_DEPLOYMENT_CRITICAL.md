# 🚨 CRITICAL: Image Deployment Process

## Problem: Vercel CDN Caching Issue

**Date Discovered:** October 21, 2025 (Week 7 - Connecticut)

### Root Cause

**`vercel.json` lines 26-35** sets aggressive 1-year immutable caching:

```json
"headers": [
  {
    "source": "/images/(.*)",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "public, max-age=31536000, immutable"
      }
    ]
  }
]
```

**What This Means:**
- When an image URL is requested for the FIRST time, Vercel CDN caches the response for **1 YEAR**
- If that first request returns 404 (image doesn't exist yet), the **404 is cached for 1 year**
- Even after deploying the actual image, browsers get the cached 404
- `curl` works because it bypasses CDN and hits origin server directly

### Symptoms

1. ✅ Images exist in git repository (verified with `git ls-files`)
2. ✅ Images deployed to Vercel (verified with `curl` returning 200 OK)
3. ✅ Database URLs are correct
4. ❌ Browser shows 404 errors for images
5. ❌ Images display as broken in beer cards

### The Solution

**Option 1: Rename Images (Used for Connecticut)**
```bash
# Rename image files to bust cache
cd "public/images/Beer images/[STATE]"
for file in *.jpg; do
  mv "$file" "$(basename "$file" .jpg)-v2.jpg"
done

# Update database URLs
npx tsx scripts/update-image-urls-for-state.ts [STATE_CODE]

# Commit and deploy
git add "public/images/Beer images/[STATE]/"
git commit -m "🔥 CACHE BUST: [State] images renamed"
git push origin main
```

**Option 2: Query String Cache Buster (Easier for Future)**
Add `?v=2` to image URLs in database instead of renaming files.

---

## 🎯 WEEKLY IMAGE DEPLOYMENT CHECKLIST

### **CRITICAL: Follow This Order Exactly!**

#### **Friday/Saturday - Content Preparation**

1. **Collect 7 beer images** for next state
2. **Name files correctly** (lowercase, hyphens, .jpg)
   ```
   brewery-name-beer-name.jpg
   ```

#### **Sunday - BEFORE Weekly Transition (Before 3 AM UTC Monday)**

3. **Add images to repository**
   ```bash
   # Copy images to correct directory
   cp downloaded-images/* "public/images/Beer images/[NextState]/"

   # Verify images exist
   ls -la "public/images/Beer images/[NextState]/"
   ```

4. **Commit and push images FIRST**
   ```bash
   git add "public/images/Beer images/[NextState]/"
   git commit -m "📸 ADD: [State] beer images for Week X"
   git push origin main
   ```

5. **WAIT for Vercel deployment to complete** (1-2 minutes)
   - Go to https://vercel.com/dashboard
   - Wait for green checkmark ✅
   - **DO NOT PROCEED until images are live on Vercel**

6. **Verify images are accessible**
   ```bash
   curl -I "https://www.hopharrison.com/images/Beer%20images/[State]/first-image.jpg"
   # Should return: HTTP/2 200
   ```

7. **Now add beer data to database**
   ```bash
   npx tsx scripts/add-[state]-beers.ts
   ```

#### **Monday Morning - After Transition**

8. **Verify page loads correctly**
   - Visit https://www.hopharrison.com/states/[state]
   - Images should display immediately
   - If broken: Images were added AFTER first request = cached 404

---

## ⚠️ If You See Cached 404s (Images Don't Show)

**This means you deployed images AFTER the weekly transition ran.**

### Quick Fix:

```bash
# 1. Rename images with cache buster
cd "public/images/Beer images/[STATE]"
for file in *.jpg; do
  mv "$file" "$(basename "$file" .jpg)-v2.jpg"
done

# 2. Update database
npx tsx -e "
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function fix() {
  const { data } = await supabase
    .from('beer_reviews')
    .select('id, image_url')
    .eq('state_code', '[STATE_CODE]');

  for (const beer of data || []) {
    await supabase
      .from('beer_reviews')
      .update({ image_url: beer.image_url.replace('.jpg', '-v2.jpg') })
      .eq('id', beer.id);
  }
}
fix();
"

# 3. Commit and redeploy
git add "public/images/Beer images/[STATE]/"
git commit -m "🔥 CACHE BUST: Rename [State] images"
git push origin main
```

---

## 📝 Key Lessons

1. **ALWAYS deploy images BEFORE they're first requested**
2. **Never add images after weekly transition runs**
3. **Vercel's immutable cache is permanent - can't clear it**
4. **Only cache-busting (rename/query string) works**
5. **curl bypasses CDN - don't rely on it for testing**

---

## 🔮 Future Improvement Considerations

**Option A: Change Cache Policy**
Modify `vercel.json` to allow revalidation:
```json
"value": "public, max-age=31536000, must-revalidate"
```

**Option B: Use Versioned URLs**
Add version query strings in BeerReviewCard component:
```typescript
src={`${review.image_url}?v=${WEEK_NUMBER}`}
```

**Option C: Pre-warm Cache**
Add a script that requests all new images after deployment to warm CDN cache.

---

## 📋 State Prep Template for Next Week (Delaware - Week 8)

```bash
# 1. Images ready by Sunday evening
ls "public/images/Beer images/Delaware/"
# Should show 7 .jpg files

# 2. Deploy images FIRST
git add "public/images/Beer images/Delaware/"
git commit -m "📸 ADD: Delaware beer images for Week 8"
git push origin main

# 3. WAIT for Vercel (check dashboard)

# 4. Verify images live
curl -I "https://www.hopharrison.com/images/Beer%20images/Delaware/dogfish-head-60min-ipa.jpg"

# 5. Add beer data to database
npx tsx scripts/add-delaware-beers.ts

# 6. Monday morning: verify https://www.hopharrison.com/states/delaware
```

---

**Last Updated:** 2025-10-21
**Affected:** Connecticut (Week 7) - Required cache busting with -v2 suffix
**Status:** Resolved with renamed images
