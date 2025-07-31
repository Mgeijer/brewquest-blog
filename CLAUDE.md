# Claude Development Notes

## Quick Server Startup Guide

### ✅ Fastest Way to Start Development Server

1. **Kill any existing processes:**
   ```bash
   pkill -f next
   lsof -ti:3000 | xargs kill -9 2>/dev/null || true
   ```

2. **Start the server with background process:**
   ```bash
   npm run dev &
   ```

3. **Access the site:**
   - Network IP: http://192.168.1.5:3000
   - Local: http://localhost:3000

### 🚨 Common Issues & Solutions

#### Issue: "This site can't be reached" / Connection Refused
**Root Cause:** Corrupted webpack cache or hanging processes

**Solution:**
```bash
# 1. Clear all Next.js processes
pkill -f next

# 2. Clear the .next cache (if needed)
rm -rf .next

# 3. Start fresh
npm run dev
```

#### Issue: TypeScript Compilation Errors Blocking Server
**Quick Fix:** Start with type checking bypassed temporarily:
```bash
SKIP_TYPE_CHECK=true npm run dev
```

#### Issue: Port Already in Use
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- --port 3001
```

### 📝 Development Workflow

1. **Before making changes:** Always verify server is running at http://192.168.1.5:3000
2. **After significant changes:** 
   - Save files and let hot reload work
   - If issues persist, restart server: `pkill -f next && npm run dev`
3. **For debugging:** Check console logs in terminal where `npm run dev` is running

### 🔧 Project-Specific Notes

#### Server Configuration
- Uses `-H 0.0.0.0` to bind to all network interfaces (allows IP access)
- Default port: 3000
- Network IP: 192.168.1.5 (check with `ifconfig | grep "inet " | grep -v 127.0.0.1`)

#### Current Known Issues
- Some TypeScript compilation errors in API routes (non-blocking for frontend)
- Webpack cache can become corrupted (clear .next if needed)
- Server needs background process (`&`) to stay running during development

#### Key Pages for Testing
- Homepage: http://192.168.1.5:3000
- Beer Reviews: http://192.168.1.5:3000/blog?category=reviews
- States: http://192.168.1.5:3000/states
- About: http://192.168.1.5:3000/about
- Privacy: http://192.168.1.5:3000/privacy
- Terms: http://192.168.1.5:3000/terms
- Contact: http://192.168.1.5:3000/contact

### 🎯 Troubleshooting Checklist

When server won't start:
1. ✅ Kill existing processes: `pkill -f next`
2. ✅ Clear port: `lsof -ti:3000 | xargs kill -9`
3. ✅ Start background process: `npm run dev &`
4. ⚠️ If still failing: `rm -rf .next && npm run dev`
5. 🔄 Last resort: Restart terminal/system

### 💡 Pro Tips

- Always start server with `&` to run in background
- Use network IP (192.168.1.5:3000) for testing on mobile devices
- Check terminal logs for successful GET requests to confirm server is working
- TypeScript errors are often non-blocking for development preview
- Webpack cache issues are common with Next.js 15 - clearing .next usually fixes them

---
*Last updated: 2024-07-29 - Server startup issues resolved*