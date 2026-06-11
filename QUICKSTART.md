# ⚡ CarbonCoach Quick Start

Get CarbonCoach running in **5 minutes**!

## 🚀 One-Command Setup

```bash
# Clone, install, setup database, and start
git clone https://github.com/Princedeepu381/Carbon-Coach.git && \
cd Carbon-Coach && \
npm install && \
cp .env.example .env && \
npx prisma generate && \
npx prisma migrate dev --name init && \
npx prisma db seed && \
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 📝 Step-by-Step (If Above Fails)

### 1. Clone & Install
```bash
git clone https://github.com/Princedeepu381/Carbon-Coach.git
cd Carbon-Coach
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

**Optional:** Add your Gemini API key to `.env`:
```env
GEMINI_API_KEY=your_key_here
```
> Get a free key at: https://aistudio.google.com/app/apikey
> 
> **Note:** App works without API key using rule-based fallback nudges

### 3. Initialize Database
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

---

## 🎯 Demo Login

1. Go to [http://localhost:3000](http://localhost:3000)
2. Click **"Log In"**
3. Click **"Log In as Priya (Demo User)"**
4. Explore the dashboard with pre-seeded data!

---

## 👥 Switch User Profiles

Click your avatar (top-right) and select:
- **Priya Sharma** - Eco-friendly lifestyle (thriving world 🌱)
- **Vikram Malhotra** - High-emission lifestyle (critical world ⚠️)

See how the Living World reacts to different carbon footprints!

---

## 🎨 Key Features to Try

### 1. Activity Logger
- Click **"Log Activity"** button
- Fill in transport/food/energy/shopping details
- Watch AI nudge suggest greener alternatives
- Accept the nudge to see instant CO₂ savings

### 2. Living World
- Navigate to **"World"** tab
- Use the timeline scrubber to travel through past days
- Click info icons to learn what affects each element
- Watch trees, sky, and river change dynamically

### 3. Insights & Analytics
- Go to **"Insights"** tab
- View AI-powered weekly diagnostics
- Compare against global benchmarks
- Export your data as JSON

### 4. Community Leaderboard
- Check **"Leaderboard"** tab
- See global rankings by reduction %
- Click on Vikram's row to switch to his profile
- Invite friends (copy invite link)

---

## 🧪 Run Tests

```bash
# Unit tests
npm test

# E2E tests (install browsers first time)
npx playwright install
npx playwright test
```

---

## 🐛 Troubleshooting

### Port 3000 in use?
```bash
npx kill-port 3000
# or
PORT=3001 npm run dev
```

### Database locked?
```bash
rm carboncoach.db
npx prisma migrate dev --name init
npx prisma db seed
```

### Prisma client not generated?
```bash
npx prisma generate
```

---

## 📚 Next Steps

- Read [SETUP.md](./SETUP.md) for detailed documentation
- Read [README.md](./README.md) for project overview
- Check [prisma/schema.prisma](./prisma/schema.prisma) for database structure
- Explore [src/lib/emissionFactors.ts](./src/lib/emissionFactors.ts) for CO₂ calculations

---

## 🎓 Learning Path

1. **Start Simple**: Log a few activities and watch the world change
2. **Explore AI**: See how Gemini suggests greener alternatives
3. **Track Progress**: Build a daily streak and watch your forest grow
4. **Compare**: Switch between user profiles to see different worlds
5. **Analyze**: Use Insights page to understand your impact
6. **Compete**: Check the Leaderboard for motivation

---

## 💡 Pro Tips

- Log activities **daily** to maintain your streak 🔥
- **Accept AI nudges** to see immediate carbon savings
- Use the **World timeline scrubber** to see your progress over time
- **Export your data** regularly from Insights page
- Try **different user profiles** to see all world states

---

## 🆘 Need Help?

- **Issues**: [GitHub Issues](https://github.com/Princedeepu381/Carbon-Coach/issues)
- **Docs**: [SETUP.md](./SETUP.md)
- **Email**: support@carboncoach.app

---

**Happy Carbon Tracking! 🌍💚**