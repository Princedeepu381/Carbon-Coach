# 🚀 CarbonCoach Setup Guide

Complete step-by-step guide to get CarbonCoach running locally and deploy to production.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** and **npm** installed ([Download](https://nodejs.org/))
- **Git** installed ([Download](https://git-scm.com/))
- A **Google Gemini API key** ([Get one free](https://aistudio.google.com/app/apikey))
- A code editor (VS Code recommended)

---

## 🛠️ Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Princedeepu381/Carbon-Coach.git
cd Carbon-Coach
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- Prisma ORM
- Google Gemini AI SDK
- Framer Motion
- Tailwind CSS
- And more...

### Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Open `.env` and add your Google Gemini API key:
```env
DATABASE_URL="file:./carboncoach.db"
GEMINI_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Getting a Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file

### Step 4: Initialize the Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with demo data
npx prisma db seed
```

This creates:
- SQLite database file (`carboncoach.db`)
- Two demo users: Priya Sharma (eco-friendly) and Vikram Malhotra (high-emission)
- Sample activities for the past 7 days
- Initial world snapshots

### Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 Quick Start Guide

### Demo Login

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. Click **"Log In"**
3. Click **"Log In as Priya (Demo User)"**
4. You'll be redirected to the dashboard with pre-seeded data

### Switching User Profiles

Click on your avatar in the top-right corner and select:
- **Priya Sharma** - Low carbon footprint (thriving world)
- **Vikram Malhotra** - High carbon footprint (critical world)

This lets you see how the Living World reacts to different emission levels.

---

## 🧪 Running Tests

### Unit Tests (Jest)

```bash
npm test
```

Tests cover:
- Emission factor calculations
- World mood algorithm
- Edge cases and error handling

### E2E Tests (Playwright)

```bash
# Install browser binaries (first time only)
npx playwright install

# Run E2E tests
npx playwright test

# View test report
npx playwright show-report
```

E2E tests cover the complete user flow:
1. Login → Dashboard
2. Open Activity Logger
3. AI nudge appears
4. Accept greener alternative
5. Submit activity
6. Verify in activity list

---

## 🗄️ Database Management

### View Database in Prisma Studio

```bash
npx prisma studio
```

Opens a visual database editor at [http://localhost:5555](http://localhost:5555)

### Reset Database

```bash
npx prisma migrate reset
```

This will:
1. Drop the database
2. Recreate it
3. Run all migrations
4. Run the seed script

### Create New Migration

```bash
npx prisma migrate dev --name your_migration_name
```

---

## 🎨 Customization

### Changing Design Tokens

Edit `src/app/globals.css` to customize:
- Color palette
- Clay shadow depths
- Animation timings
- Font sizes

### Modifying Emission Factors

Edit `src/lib/emissionFactors.ts` to update CO₂ factors based on:
- Regional electricity grids
- Updated IPCC data
- Local transport emissions

### Adjusting World Algorithm

Edit `src/lib/computeWorld.ts` to change:
- Tree count thresholds
- Sky pollution levels
- Mood state transitions

---

## 🌐 Deployment

### Option 1: Docker + Google Cloud Run

1. **Build Docker Image:**
```bash
docker build -t carboncoach .
```

2. **Test Locally:**
```bash
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key carboncoach
```

3. **Push to Google Container Registry:**
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/carboncoach
```

4. **Deploy to Cloud Run:**
```bash
gcloud run deploy carboncoach \
  --image gcr.io/YOUR_PROJECT_ID/carboncoach \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key
```

### Option 2: Vercel (Recommended for Next.js)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Add Environment Variables in Vercel Dashboard:**
   - `GEMINI_API_KEY`
   - `DATABASE_URL` (use Vercel Postgres or external DB)

### Option 3: Railway

1. Connect your GitHub repo to Railway
2. Add environment variables
3. Deploy automatically on push

---

## 🔧 Troubleshooting

### Issue: "Prisma Client not generated"

**Solution:**
```bash
npx prisma generate
```

### Issue: "GEMINI_API_KEY not found"

**Solution:**
1. Check `.env` file exists in root directory
2. Verify API key is correct
3. Restart dev server after adding key

### Issue: "Database locked" error

**Solution:**
```bash
# Close Prisma Studio if open
# Delete the database and recreate
rm carboncoach.db
npx prisma migrate dev --name init
npx prisma db seed
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm run dev
```

### Issue: AI nudges not appearing

**Solution:**
1. Verify `GEMINI_API_KEY` is set correctly
2. Check console for API errors
3. The app will fall back to rule-based nudges if Gemini fails

---

## 📊 Database Schema

### User
- `id`: Unique identifier
- `name`: Display name
- `weeklyGoalKg`: Carbon budget (default: 42 kg)
- `createdAt`: Registration date

### Activity
- `id`: Unique identifier
- `userId`: Foreign key to User
- `category`: transport | food | energy | shopping
- `subType`: Specific activity type
- `quantity`: Amount logged
- `co2Kg`: Calculated emissions
- `nudgeShown`: Whether AI nudge was displayed
- `nudgeAccepted`: Whether user accepted the nudge
- `loggedAt`: Timestamp

### WorldSnapshot
- `id`: Unique identifier
- `userId`: Foreign key to User
- `snapshotDate`: Date of snapshot
- `totalCo2Kg`: Daily total emissions
- `treeCount`: Number of trees in world
- `skyPollution`: Pollution level (0-1)
- `worldMood`: thriving | neutral | stressed | critical

### Streak
- `id`: Unique identifier
- `userId`: Foreign key to User
- `type`: Streak type (e.g., "daily_log")
- `currentStreak`: Current consecutive days
- `longestStreak`: All-time best streak
- `lastUpdated`: Last activity date

---

## 🎓 Learning Resources

### Understanding Carbon Footprints
- [IPCC Climate Reports](https://www.ipcc.ch/)
- [Carbon Footprint Calculator](https://www.carbonfootprint.com/)
- [Climate Action Tracker](https://climateactiontracker.org/)

### Next.js Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)

### Prisma ORM
- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

### Google Gemini AI
- [Gemini API Docs](https://ai.google.dev/docs)
- [Structured Output Guide](https://ai.google.dev/docs/structured_output)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `file:./carboncoach.db` | SQLite database path |
| `GEMINI_API_KEY` | No* | - | Google Gemini API key |
| `NEXT_PUBLIC_APP_URL` | No | `http://localhost:3000` | App base URL |
| `NODE_ENV` | No | `development` | Environment mode |

*App works without Gemini API key using rule-based fallback nudges

---

## 🎯 Next Steps

After setup, explore:

1. **Dashboard** - View your Living World and carbon stats
2. **Activity Logger** - Log activities and see AI nudges
3. **World Simulator** - Travel through time with the scrubber
4. **Insights** - Get AI diagnostics and benchmarks
5. **Leaderboard** - Compare with the community

---

## 💡 Tips for Best Experience

1. **Log activities daily** to maintain your streak
2. **Accept AI nudges** to see immediate carbon savings
3. **Switch between user profiles** to see different world states
4. **Export your data** regularly from the Insights page
5. **Check the Leaderboard** for motivation

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Princedeepu381/Carbon-Coach/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Princedeepu381/Carbon-Coach/discussions)
- **Email**: support@carboncoach.app

---

**Happy Carbon Tracking! 🌱**