# ✨ StudyForge — AI Homework Organizer

**Turn chaos into a 7-day study plan.**

StudyForge is an intelligent homework planner that converts raw assignments into a structured, optimized 7-day study schedule weighted by difficulty and urgency.

## 🚀 Features

- **Smart Assignment Input** - Add homework with title, subject, difficulty, time estimate, due date, and notes
- **AI Study Plan Generator** - Intelligent algorithm that:
  - Prioritizes harder tasks earlier in the week
  - Urgently schedules assignments with sooner deadlines
  - Balances workload across all 7 days
  - Optimizes study time distribution
- **Beautiful Space-Themed UI** - Clean, dark interface with glowing gradients and smooth animations
- **LocalStorage Persistence** - All data saves automatically in your browser
- **7-Day Grid Dashboard** - Visual breakdown of tasks for Monday through Sunday
- **Zero Configuration** - No API keys or environment variables needed

## 📦 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling with custom space theme
- **LocalStorage** - Client-side data persistence

## 🏃‍♂️ Local Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

The app will run on the port specified by the `PORT` environment variable (defaults to 3000).

## 🚂 Deploy to Railway

Railway deployment is **instant** with zero manual configuration required.

### Step-by-Step Deployment:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial StudyForge deployment"
   git push origin main
   ```

2. **Go to [Railway](https://railway.app/)**
   - Sign up or log in with GitHub

3. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your StudyForge repository

4. **Railway Auto-Detection**
   - Railway will automatically detect the Dockerfile
   - Build will start immediately
   - No environment variables needed!

5. **Get Your URL**
   - Once deployed, Railway provides a public URL
   - Click "Generate Domain" if not auto-generated
   - Your app is live! 🎉

### Railway Configuration (Already Included)

The project includes:
- ✅ `Dockerfile` - Multi-stage build for optimal performance
- ✅ `railway.json` - Deployment configuration
- ✅ `.dockerignore` - Optimized Docker builds
- ✅ Port handling via `process.env.PORT`

### Expected Deploy Time
- **Build**: 2-3 minutes
- **Start**: 5-10 seconds
- **Total**: ~3 minutes from push to live

## 📱 How to Use

### 1. Add Homework Assignments
- Fill out the form with assignment details
- Set difficulty level (Easy, Medium, Hard)
- Estimate time needed in minutes
- Add a due date

### 2. Generate Your Study Plan
- Click "🚀 Generate 7-Day Plan"
- The AI algorithm analyzes all assignments
- Creates optimized daily schedule

### 3. View Your Schedule
- See tasks distributed across Monday-Sunday
- Each day shows total time and task breakdown
- Tasks sorted by difficulty within each day

### 4. Track Progress
- Check off completed tasks
- Data persists automatically
- Regenerate plan as needed

## 🎨 UI Highlights

- **Space Theme** - Deep blues, purples, and glowing accents
- **Smooth Animations** - Hover effects, transitions, and micro-interactions
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Accessibility** - Clear labels, good contrast, keyboard navigation

## 🧠 Algorithm Details

The study plan generator uses intelligent prioritization:

1. **Urgency Scoring** (0-10 scale)
   - Due in 1 day: Score 10
   - Due in 2 days: Score 8
   - Due in 3 days: Score 6
   - Due in 5 days: Score 4
   - Due in 7 days: Score 2

2. **Difficulty Weighting**
   - Hard: 3 points
   - Medium: 2 points
   - Easy: 1 point

3. **Priority Calculation**
   - `Priority = (Urgency × 2) + (Difficulty × 1.5)`

4. **Distribution Strategy**
   - Sort by priority (highest first)
   - Hard tasks → Earlier in week
   - Balance daily workload (max 180 min/day default)
   - Fill lightest days first when needed

## 🛠️ Project Structure

```
studyforge/
├── app/
│   ├── globals.css          # TailwindCSS + custom styles
│   ├── layout.tsx            # Root layout with metadata
│   ├── page.tsx              # Home page (input/assignments)
│   └── plan/
│       └── page.tsx          # Study plan page
├── components/
│   ├── HomeworkForm.tsx      # Assignment input form
│   ├── AssignmentList.tsx    # Display all assignments
│   └── StudyPlanGrid.tsx     # 7-day grid display
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── storage.ts            # LocalStorage utilities
│   └── studyPlanGenerator.ts # AI algorithm logic
├── Dockerfile                # Multi-stage production build
├── railway.json              # Railway deployment config
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # TailwindCSS theme
└── package.json              # Dependencies & scripts
```

## 🔧 Troubleshooting

### Build fails on Railway
- Ensure all files are committed to Git
- Check that Dockerfile is in the root directory
- Verify railway.json is present

### App won't start
- Check Railway logs for errors
- Ensure PORT is properly set in next.config.js
- Verify standalone output is enabled

### LocalStorage not persisting
- Check browser privacy settings
- Ensure cookies/storage is enabled
- Try a different browser

## 📄 License

MIT License - feel free to use for personal or educational purposes.

## 🤝 Contributing

This is a learning project. Feel free to fork and customize!

---

**Made with ✨ by StudyForge Team**

*Organize smarter, study better.*
