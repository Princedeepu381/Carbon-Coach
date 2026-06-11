# 🌱 CarbonCoach - AI-Powered Personal Carbon Footprint Tracker

## 📋 Challenge Vertical: Sustainability & Climate Action

CarbonCoach is an intelligent personal carbon footprint tracking application that gamifies sustainable living through a dynamic "Living World" visualization that responds to your daily choices.

## 🎯 Project Overview

**Problem Statement:** Climate change requires individual action, but most people don't understand their carbon impact or how to reduce it effectively.

**Solution:** CarbonCoach uses AI to provide personalized, actionable insights that make carbon reduction engaging and achievable through:
- Real-time carbon footprint tracking
- AI-powered behavioral nudges
- Gamified visual feedback (Living World)
- Personalized weekly insights

## ✨ Key Features

### 1. **AI-Powered Smart Nudges**
- Uses Google Gemini AI to analyze user activities
- Suggests greener alternatives in real-time
- Calculates potential CO₂ savings
- Contextual recommendations based on weekly patterns

### 2. **Living World Visualization**
- Dynamic 3D ecosystem that responds to your carbon footprint
- Visual states: Thriving (green forest) → Critical (withered landscape)
- Real-time tree count, sky pollution, and mood indicators
- Emotional connection to environmental impact

### 3. **Comprehensive Tracking**
- **Transport:** Car, bus, metro, bicycle, flights
- **Food:** Meal types with carbon calculations
- **Energy:** Electricity, AC usage, appliances
- **Shopping:** Online deliveries, clothing, electronics

### 4. **Personalized Insights**
- AI analyzes weekly patterns
- Identifies highest-impact categories
- Provides specific, actionable recommendations
- Tracks progress with streak system

### 5. **Gamification Elements**
- Daily logging streaks
- Weekly challenges (Meatless Monday, Transit Champion)
- Community savings milestones
- Achievement badges

## 🏗️ Technical Architecture

### **Frontend**
- **Framework:** Next.js 14 (React 18)
- **Styling:** Tailwind CSS with custom claymorphism design
- **Animations:** Framer Motion for smooth transitions
- **State Management:** React Hooks
- **UI Components:** Custom animated components library

### **Backend**
- **API Routes:** Next.js API routes
- **Database:** SQLite with Prisma ORM
- **AI Integration:** Google Gemini API
- **Authentication:** Session-based with localStorage

### **AI Features**
- **Model:** Google Gemini 1.5 Flash
- **Use Cases:**
  - Activity nudges (suggest alternatives)
  - Weekly insights (pattern analysis)
  - Personalized recommendations
- **Fallback:** Rule-based logic when API unavailable

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+ 
npm or yarn
Git
```

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd carbon-coach
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file:
```env
DATABASE_URL="file:./carboncoach.db"
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

4. **Initialize database**
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

5. **Run development server**
```bash
npm run dev
```

6. **Open application**
Navigate to `http://localhost:3000`

## 🔐 Demo Credentials

| Email | Password | Profile |
|-------|----------|---------|
| priya@carboncoach.com | priya123 | Eco-conscious user (Thriving) |
| vikram@carboncoach.com | vikram123 | High-footprint user (Critical) |
| demo@carboncoach.com | demo123 | Demo account |

## 📊 How It Works

### 1. **Activity Logging**
```
User logs activity → Calculate CO₂ → AI analyzes → Suggest alternative → Update world state
```

### 2. **World State Calculation**
```javascript
Daily CO₂ / Daily Goal = Ratio
- Ratio ≤ 0.5: Thriving (18 trees, clear sky)
- Ratio ≤ 1.0: Neutral (10 trees, light haze)
- Ratio ≤ 1.5: Stressed (4 trees, pollution)
- Ratio > 1.5: Critical (1 tree, heavy pollution)
```

### 3. **AI Nudge Logic**
```
1. Fetch user's weekly activity pattern
2. Send to Gemini API with context
3. Receive personalized suggestion
4. Display if savings > 0.5kg CO₂
5. Track acceptance for learning
```

## 🎨 Design Philosophy

**Claymorphism UI:** Soft, tactile design that feels approachable and friendly
**Micro-interactions:** Every action has delightful feedback
**Progressive disclosure:** Information revealed as needed
**Emotional design:** Living World creates emotional connection

## 📈 Impact Metrics

- **Carbon Tracking:** Real-time CO₂ calculations
- **Behavioral Change:** AI nudge acceptance rate
- **Engagement:** Daily streak tracking
- **Community:** Collective savings visualization

## 🔒 Security & Performance Considerations

- **Robust Input Validation:** Strictly enforced using Zod schemas on both frontend forms and backend API routes.
- **In-Memory Rate Limiting:** Implemented a robust rate limiter (`src/lib/rateLimit.ts`) protecting backend endpoints `/api/*` (activities, nudge, streaks, world) from API abuse and excessive Gemini API calls. Logs IP-based request limits (10 requests/minute) and automatically purges old records every 5 minutes.
- **Client Render Optimizations:** Resolved React Hook dependency (`react-hooks/exhaustive-deps`) warnings inside page routes and custom forms to prevent unnecessary rendering passes.
- **SQL Injection Prevention:** Structured queries handled exclusively via Prisma ORM.
- **Environment Separation:** API keys and database parameters separated into `.env` configurations.

## ☁️ Google Cloud Deployment (Cloud Run)

CarbonCoach is configured for continuous delivery and containerized deployment to Google Cloud Run:
- **`Dockerfile`**: A multi-stage production Docker build optimized for Next.js.
- **`cloudbuild.yaml`**: Standard Google Cloud Build workflow detailing compilation, image building (stored in Google Container Registry), and automated deployment.
- **`service.yaml`**: Knative Service specification outlining resource configurations (1Gi RAM, 1 CPU limits) and routing parameters for Cloud Run.

## 🧪 Testing Suite

- **Unit Testing:** Runs local component and utility test suites:
  ```bash
  npm test
  ```
- **End-to-End Testing:** Integrates Playwright E2E tests (`tests/e2e/logActivity.spec.ts`) validating complete user workflows:
  - User Login flow
  - Activity Logging panel accessibility
  - Dynamic AI Coach Nudge cards
  - Switch-to-Green recommendation triggers and database persistence
  ```bash
  npx playwright test
  ```

## 📦 Project Structure

```
carbon-coach/
├── src/
│   ├── app/              # Next.js pages & API routes
│   ├── components/       # React components
│   │   ├── Animated/     # Claymorphism & animation wrappers
│   │   ├── Dashboard/    # Statistics & chart widgets
│   │   ├── Landing/      # Dynamic parallax landing sections
│   │   ├── LivingWorld/  # World canvas & carbon orb
│   │   └── LogForm/      # Forms & AI nudge cards
│   └── lib/              # Utilities & middleware
│       ├── animations/   # Animation hooks & parameters
│       ├── computeWorld.ts  # Forest state compiler
│       ├── emissionFactors.ts  # Carbon footprint coefficients
│       ├── gemini.ts     # Multi-model cascade Gemini client
│       ├── rateLimit.ts  # In-memory IP rate limiter
│       └── prisma.ts     # Database connection client
├── tests/
│   └── e2e/              # Playwright E2E test scripts
├── prisma/
│   ├── schema.prisma     # Prisma database schema
│   └── seed.ts           # SQLite mock seeding data
├── cloudbuild.yaml       # GCP automated build pipeline
├── service.yaml          # Knative Cloud Run container configurations
└── Dockerfile            # Multi-stage production container instructions
```

## 🌟 Key Innovations

1. **Emotional Gamification:** Living World creates emotional investment
2. **AI-Powered Personalization:** Context-aware recommendations
3. **Real-time Feedback:** Instant visual response to actions
4. **Holistic Tracking:** Covers all major carbon sources
5. **Behavioral Science:** Nudges based on proven psychology

## 🔮 Future Enhancements

- Social features (friends, challenges)
- Carbon offset marketplace integration
- Mobile app (React Native)
- Wearable device integration
- Advanced ML for prediction
- Multi-language support

## 📝 Assumptions

1. Users have basic understanding of carbon footprint
2. Emission factors are India-specific averages
3. Weekly goal of 42kg CO₂ (6kg/day) is sustainable target
4. Users are motivated by visual feedback
5. AI suggestions are educational, not prescriptive

## 🤝 Contributing

This project was built for the AI hackathon. Contributions welcome after evaluation period.

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Built with ❤️ by Princedeepu381 for the AI Hackathon 2026

## 🙏 Acknowledgments

- Google Gemini AI for intelligent recommendations
- Prisma for elegant database management
- Framer Motion for smooth animations
- Next.js team for amazing framework

---

**Made with 🌱 for a sustainable future**
