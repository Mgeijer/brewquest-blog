# Weekly State Prep Checklist

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

### **Sunday** - Automated Transition (3:00 AM UTC)

The weekly-transition cron will:
- ✅ Mark previous state as completed
- ✅ Set next state as current
- ✅ Clear caches
- ⚠️ **WILL NOT** add beer images (must be done manually)

### **Manual Image Deployment (Sunday Evening)**

Before Monday morning:
```bash
# 1. Ensure images are in correct directory
ls "public/images/Beer images/[NextState]/"

# 2. Commit and push images
git add "public/images/Beer images/[NextState]/"
git commit -m "📸 ADD: [State] beer images for Week X"
git push origin main
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
