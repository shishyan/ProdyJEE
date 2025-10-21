# ProdyJEE - AI Coding Agent Instructions

## Architecture Overview

**ProdyJEE** is a Next.js 15 educational app for JEE/CBSE students featuring study planning, goal tracking, and task management. Key architectural decisions:

- **Framework**: Next.js 15 with Pages Router (not App Router)
- **Databases**: Dual setup - Prisma + SQLite for curriculum data, Firebase Firestore for user data
- **Mobile**: Capacitor for Android app builds
- **UI**: Glass morphism design with modular CSS architecture
- **State**: localStorage for UI preferences, Firebase for user data

## Core Data Models

**Study Plans** (`prisma/schema.prisma`):
- Curriculum-based (CBSE/JEE) with grades (6,11,12)
- Hierarchical: Subject → Chapter → Topic → Sub-topic
- Learning stages: Initiated → Skimmed → Grasped → Practiced → Revised
- Proficiency levels: Novice → Competent → Expert → Master

**Goals System** (`lib/db.js`):
- SQLite-based with star reward system
- 29 pre-seeded goals across Academic/Behavioral/Emotional categories
- Progress tracking with thresholds

**Kanban Tasks** (`prisma/schema.prisma`):
- MS Planner-style with Plans → Buckets → Tasks → Sub-tasks
- Priority levels, progress tracking, comments, labels

## Critical Workflows

### Development Server
```bash
npm run dev  # Uses dev.js to find free port (3000-3100)
```

### Database Operations
```bash
npm run prisma:generate  # Generate Prisma client
npm run prisma:push      # Push schema to SQLite
npm run seed            # Run prisma/seed.js (study plans)
node seed-study-plan.js # Alternative seeding script
```

### Mobile Builds
```bash
npm run build:android   # Full build + Capacitor sync + open Android Studio
npm run android:sync    # Sync web assets to Android
npm run android:run     # Build and run on device/emulator
```

### Data Export (Required for Builds)
```bash
npm run export:db  # Exports Prisma data to public/database-export.json
```
Runs automatically in `prebuild` script.

## Project-Specific Patterns

### Dual Database Usage
- **Prisma/SQLite**: Static curriculum data (study plans, subjects, chapters)
- **Firebase Firestore**: User-specific data (progress, custom plans)
- Use `lib/firestore-service.js` for Firebase operations
- Use `lib/db.js` for SQLite goals (legacy system)

### UI Components
- **Drag & Drop**: `@dnd-kit` for kanban board interactions
- **Background System**: 33+ backgrounds with categories, custom upload via FileReader API
- **Glass Effects**: CSS backdrop-filter for modern UI
- **Responsive Design**: Mobile-first with Capacitor considerations

### Data Seeding
- Extensive seeding scripts: `seed-study-plan.js`, `seed-grade6.js`, `seed-jee-class11.js`
- CSV imports: `Grade6-CBSE.csv`, `ProdyJEE(CBSE-6).csv`, `ProdyJEE(JEE).csv`
- Use `import-all-data.js` for bulk operations

### File Organization
- **Pages**: `/pages` directory (Pages Router)
- **Components**: `/components` directory
- **Styles**: Modular CSS in `/styles` (migrating from monolithic `globals.css`)
- **Lib**: Core services (`db.js`, `firebase.js`, `firestore-service.js`, `useAuth.js`)
- **Prisma**: Database schema and seeds in `/prisma`

### Build Considerations
- `webDir: 'out'` in `capacitor.config.ts` (static export)
- Database export required before builds
- PWA support with `next-pwa`
- Android splash screen and status bar configuration

## Common Patterns

### State Management
```javascript
// UI state in localStorage
localStorage.setItem('selectedBackground', backgroundData)
const bg = localStorage.getItem('selectedBackground')

// Firebase user data
import { fetchStudyPlans } from '../lib/firestore-service'
const plans = await fetchStudyPlans(userId)
```

### Component Structure
```javascript
// Modern icon components as inline SVGs
const ChartBarIcon = () => (
  <svg className="nav-icon w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor"...>
)

// Progress bars with percentage calculations
const ProgressBar = ({ value, max, color = 'blue', label }) => {
  const percentage = Math.min((value / max) * 100, 100)
```

### Database Queries
```javascript
// Prisma queries with relations
const studyPlans = await prisma.studyPlan.findMany({
  orderBy: [
    { subject: 'asc' },
    { chapter_id: 'asc' },
    { topic_id: 'asc' }
  ]
})

// Firebase queries with user filtering
const q = query(
  collection(db, STUDY_PLANS_COLLECTION),
  where('userId', '==', userId)
)
```

## Key Files to Reference

- `prisma/schema.prisma` - Complete data model
- `lib/firestore-service.js` - Firebase data operations
- `lib/db.js` - SQLite goals system
- `package.json` - All npm scripts and dependencies
- `capacitor.config.ts` - Mobile app configuration
- `styles/globals.css` - Main stylesheet (7700+ lines)
- `export-db-to-json.js` - Build-time data export logic</content>
<parameter name="filePath">c:\Users\shishyan\ProdyJEE\.github\copilot-instructions.md