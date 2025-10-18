# Goals Database System

## Overview
This system uses SQLite to store and track JEE aspirant goals with automatic star awards.

## Database Structure

### Tables

#### 1. `goals`
Stores all goal definitions
- `id` - Primary key
- `goal_key` - Unique identifier
- `subject` - Subject (Chemistry, Mathematics, Physics)
- `phrase` - Goal description
- `metric` - What is being tracked
- `category` - academic, behavioral, or emotional
- `current_value` - Current progress value
- `current_stars` - Number of stars earned
- `is_template` - Whether it's a pre-defined template
- `completed` - Whether goal is completed
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

#### 2. `goal_thresholds`
Stores star award thresholds for each goal
- `id` - Primary key
- `goal_key` - Foreign key to goals
- `star_count` - Number of stars (1-5)
- `range_description` - Description of requirement (e.g., "≥90%")

#### 3. `goal_progress`
Logs progress history
- `id` - Primary key
- `goal_key` - Foreign key to goals
- `value` - Progress value
- `stars_earned` - Stars earned at this point
- `logged_at` - Timestamp

## Sample Goals Included

### Academic (11 goals)
- Achieve mastery across all subjects in mock tests
- Excel in Mathematics with precision
- Complete the entire syllabus before January
- Solve past year questions
- Refine memory through revisions
- Finish Physics topic today
- Solve 10 Math problems daily
- Revise Chemistry notes weekly
- Score 75% in mock tests
- Understand tough concepts daily
- Complete NCERT exercises on time

### Behavioral (11 goals)
- Show up for every test
- Build homework discipline streak
- Maintain study streak
- Resolve doubts consistently
- Log study hours with commitment
- Maintain full test attendance
- Build 7-day study streak
- Submit homework on time
- Ask doubts without hesitation
- Take guilt-free study breaks
- Avoid phone distractions

### Emotional (7 goals)
- Reflect weekly
- Celebrate small wins
- Rate confidence weekly
- Write daily reflections
- Celebrate wins every day
- Rate confidence 7 or higher
- Encourage friends

## API Endpoints

### GET `/api/goals-db`
Fetch all goals with their star thresholds

### POST `/api/goals-db`
Create a new custom goal
```json
{
  "subject": "Chemistry",
  "phrase": "My custom goal",
  "metric": "What I'm tracking",
  "category": "academic",
  "stars": [
    { "count": 1, "range": "description" }
  ]
}
```

### PUT `/api/goals-db`
Update goal progress
```json
{
  "goalKey": "template-academic-1",
  "currentValue": 85,
  "currentStars": 3,
  "completed": false
}
```

### DELETE `/api/goals-db?goalKey=xxx`
Delete a goal and its related data

## Usage in Frontend

The goals.js page already includes all 29 sample goals in the `goalTemplates` object. These are displayed in the Templates sidebar panel.

To integrate with SQLite:
1. Install dependencies: `npm install`
2. The database will be auto-created with sample data on first run
3. Use the API routes to fetch/update goals instead of localStorage

## Star Award Logic

Each goal has 1-5 star thresholds:
- ⭐ (1 star) = 10 points
- ⭐⭐ (2 stars) = 20 points
- ⭐⭐⭐ (3 stars) = 30 points
- ⭐⭐⭐⭐ (4 stars) = 40 points
- ⭐⭐⭐⭐⭐ (5 stars) = 50 points + Badge (100 bonus points)

Total points = (stars × 10) + (badges × 100)

## Color Coding

Categories use different colors:
- **Academic**: Blue tones
- **Behavioral**: Green tones
- **Emotional**: Purple/Pink tones

Star display uses gold/yellow for visual clarity.

## Implementation Status

✅ 29 sample goals added to goalTemplates
✅ SQLite database schema created
✅ API routes for CRUD operations
✅ Star calculation logic
✅ Category-based filtering

🔄 TODO: Switch from localStorage to SQLite API calls
🔄 TODO: Add goal progress tracking UI
🔄 TODO: Implement automatic star calculation based on metrics
