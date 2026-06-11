# 🪟 Windows Setup Guide for CarbonCoach

## ⚡ Quick Start (Copy-Paste These Commands)

### Step 1: Clean Install (if npm install is stuck)
```powershell
# Wait for current npm install to finish first!
# Then run these one by one:

# Delete old files (PowerShell syntax)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Force prisma\dev.db -ErrorAction SilentlyContinue

# Fresh install
npm install
```

### Step 2: Setup Database
```powershell
# Generate Prisma Client
npx prisma generate

# Create database
npx prisma migrate dev --name init

# Add demo data
npx prisma db seed
```

### Step 3: Start App
```powershell
npm run dev
```

Then open: http://localhost:3000

---

## 🐛 If Buttons Still Don't Work

### Check 1: Is the app running?
Look for this in terminal:
```
✓ Ready in 2.3s
- Local: http://localhost:3000
```

### Check 2: Open browser console
1. Press F12 in browser
2. Go to Console tab
3. Look for red errors

### Check 3: Test each button
1. Go to http://localhost:3000
2. Click "Log In" (top right)
3. Should go to http://localhost:3000/login
4. Click "Log In as Priya (Demo User)"
5. Should go to http://localhost:3000/dashboard

---

## 🚨 Common Windows Issues

### Issue 1: "npm install" is stuck
**Solution:**
```powershell
# Press Ctrl+C to stop
# Then try:
npm install --legacy-peer-deps
```

### Issue 2: "Port 3000 already in use"
**Solution:**
```powershell
# Find and kill process
netstat -ano | findstr :3000
# Note the PID number, then:
taskkill /PID <number> /F

# Or use different port:
npm run dev -- -p 3001
```

### Issue 3: "Prisma Client not found"
**Solution:**
```powershell
npx prisma generate
npm run dev
```

### Issue 4: "ENOENT: no such file or directory"
**Solution:**
```powershell
# Make sure you're in the right directory
cd "C:\Users\deepa\Downloads\Carbon Coach"

# Check if package.json exists
dir package.json
```

---

## ✅ Complete Reset (If Nothing Works)

Run these commands ONE BY ONE:

```powershell
# 1. Stop the dev server (Ctrl+C)

# 2. Delete everything
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Force prisma\dev.db -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# 3. Fresh install
npm install

# 4. Setup database
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# 5. Start app
npm run dev
```

---

## 📊 Verify Everything Works

### Test 1: Landing Page
1. Go to http://localhost:3000
2. Click "Start Journey" → Should go to /signup ✓
3. Go back, click "Log In" → Should go to /login ✓

### Test 2: Login
1. Go to http://localhost:3000/login
2. Click "Log In as Priya (Demo User)"
3. Should go to /dashboard ✓
4. Should see "Thriving Living World" banner ✓

### Test 3: Dashboard
1. Click "Log Activity" button → Modal should open ✓
2. Click "World" in sidebar → Should go to /world ✓
3. Click "Insights" → Should go to /insights ✓
4. Click "Leaderboard" → Should go to /leaderboard ✓

**If all these work, your app is perfect!** 🎉

---

## 💡 Still Having Issues?

Tell me:
1. What you see in PowerShell terminal
2. What you see in browser console (F12)
3. Which specific button doesn't work
4. What happens when you click it

Then I can help you fix it!

---

## 🎯 Expected Terminal Output

When you run `npm run dev`, you should see:

```
> carboncoach@0.1.0 dev
> next dev

  ▲ Next.js 14.2.18
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Starting...
 ✓ Ready in 2.3s
```

**If you see this, the app is running correctly!**

---

## 🔧 Windows-Specific Commands Reference

| Task | Linux/Mac | Windows PowerShell |
|------|-----------|-------------------|
| Delete folder | `rm -rf folder` | `Remove-Item -Recurse -Force folder` |
| Delete file | `rm file` | `Remove-Item -Force file` |
| List files | `ls` | `dir` or `Get-ChildItem` |
| Change directory | `cd folder` | `cd folder` (same) |
| Kill process | `kill -9 PID` | `taskkill /PID <PID> /F` |
| Find port usage | `lsof -i :3000` | `netstat -ano \| findstr :3000` |

---

**Your CarbonCoach app is ready to win the hackathon!** 🏆🌱