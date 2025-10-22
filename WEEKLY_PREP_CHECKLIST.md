# Weekly State Prep Checklist

## 🚨 CRITICAL WARNING: Image Deployment Order

**READ THIS FIRST:** See `IMAGE_DEPLOYMENT_CRITICAL.md` for full details.

**TL;DR:** Images MUST be deployed to Vercel BEFORE the weekly transition runs (Monday 3 AM UTC).

- ❌ **WRONG ORDER:** Transition runs → Database updated → Then add images = **CACHED 404s for 1 year**
- ✅ **CORRECT ORDER:** Add images → Deploy to Vercel → Wait for deployment → Then transition runs

**If you mess this up:** Images will show 404 even though they exist. You'll need to rename all images with `-v2` suffix to bust the cache.

---

## Preparation Timeline (Before Each Monday)

### **Friday/Saturday** - Content Preparation

**1. Beer Research & Selection**
- Research 7 authentic beers from next week's state
- Verify brewery information and tasting notes
- Ensure geographic diversity across the state

**2. Image Collection**
- Download/prepare 7 beer images
- **CRITICAL**: Name files correctly:
  ```
  public/images/Beer images/[STATE_NAME]/
  ├── brewery-name-beer-name.jpg
  ├── brewery-name-beer-name.jpg
  └── ... (7 total)
  ```
- **Example for Delaware (Week 8)**:
  ```
  public/images/Beer images/Delaware/
  ├── dogfish-head-60min-ipa.jpg
  ├── dewey-beer-secret-machine.jpg
  └── ... (5 more)
  ```

**3. Database Preparation**
- Beer reviews will be added automatically on Sunday by cron
- OR manually add using: `scripts/add-[state]-beers.ts`

### **Sunday** - CRITICAL: Image Deployment BEFORE Transition

**⏰ TIMING IS EVERYTHING:** Complete by Sunday evening (before Monday 3 AM UTC)

**Step 1: Deploy Images FIRST** (Sunday Evening)
```bash
# 1. Ensure images are in correct directory
ls "public/images/Beer images/[NextState]/"
# Should show 7 .jpg files

# 2. Commit and push images
git add "public/images/Beer images/[NextState]/"
git commit -m "📸 ADD: [State] beer images for Week X"
git push origin main

# 3. ⏳ WAIT for Vercel deployment to complete (check vercel.com/dashboard)
# Look for green ✅ checkmark - usually takes 1-2 minutes

# 4. Verify images are live on production
curl -I "https://www.hopharrison.com/images/Beer%20images/[State]/first-image-name.jpg"
# Should return: HTTP/2 200 (not 404!)
```

**Step 2: Automated Transition Runs** (Monday 3:00 AM UTC)

The weekly-transition cron will:
- ✅ Mark previous state as completed
- ✅ Set next state as current
- ✅ Clear caches
- ✅ Images already deployed = Everything works! 🎉

**Step 3: Add Beer Data** (Optional - Can be done before or after transition)
```bash
npx tsx scripts/add-[state]-beers.ts
```

---

## Current Week Schedule

| Week | State | Status | Images Ready? |
|------|-------|--------|---------------|
| 6 | Colorado | Completed | ✅ |
| 7 | Connecticut | Current | ✅ |
| 8 | Delaware | Next | ⚠️ **TODO** |

---

## Image Checklist Template

For **Delaware (Week 8)**:
- [ ] 7 beer images collected
- [ ] Files named correctly (lowercase, hyphens)
- [ ] Placed in `public/images/Beer images/Delaware/`
- [ ] Committed to git before Sunday evening
- [ ] Verified image URLs in database match filenames

---

## Common Issues

### Typo in Directory Name
❌ **WRONG**: `Conecticut` (missing 'n')
✅ **CORRECT**: `Connecticut`

### File Naming Convention
❌ **WRONG**: `Two Roads Workers Comp.jpg` (spaces, capitals)
✅ **CORRECT**: `two-roads-workers-comp-saison.jpg` (lowercase, hyphens)

### Image Format
- ✅ Use `.jpg` or `.png`
- ✅ Optimize for web (< 500KB per image)
- ✅ Minimum 800px width recommended
