# Alfanumrik Learning and Assessment Platform

A comprehensive full-stack learning and assessment platform built with Next.js, TypeScript, Tailwind CSS, PostgreSQL, and Prisma ORM.

## Features

### 1. **Authentication Module**
- Student Registration with email and password
- Secure Login with JWT tokens
- Session management with localStorage
- Password hashing with bcryptjs

### 2. **Chapter Content Management**
- Structured chapter organization by subject and class level
- Topic-wise learning sections with detailed content
- Dynamic content rendering from database
- Chapter overview and key concepts

### 3. **Learning Experience**
- Interactive chapter study pages with expandable topics
- Organized content structure with revision notes
- Seamless navigation between chapters
- Responsive design for all devices

### 4. **MCQ Assessment Module**
- 20+ Multiple Choice Questions per chapter
- Four options per question with correct answers
- Detailed explanations for each question
- Difficulty levels (easy, medium, hard)
- Random question ordering

### 5. **Online Examination Workflow**
- Timed assessment sessions (30-minute default)
- Real-time timer with visual indicators
- Answer auto-save functionality
- Next/Previous question navigation
- Question status indicators (answered/unanswered)
- Answer review panel with quick navigation

### 6. **Performance Dashboard**
- Overall statistics and metrics
- Chapter-wise performance breakdown
- Total attempts and scores tracking
- Accuracy and completion status
- Recent attempt history
- Performance trends visualization

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Zod

## Project Structure

```
alfanumrik/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   └── register/
│   │   │       └── route.ts
│   │   ├── chapters/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── assessments/
│   │   │   ├── start/
│   │   │   │   └── route.ts
│   │   │   ├── save-answer/
│   │   │   │   └── route.ts
│   │   │   └── submit/
│   │   │       └── route.ts
│   │   └── dashboard/
│   │       └── route.ts
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── chapters/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── assessment/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── results/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── auth.ts
│   ├── validation.ts
│   └── api.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── README.md
```

## Database Schema

### Tables

1. **User**
   - id (Primary Key)
   - email (Unique)
   - password (Hashed)
   - fullName
   - createdAt, updatedAt

2. **Chapter**
   - id (Primary Key)
   - title
   - description
   - subject
   - classLevel
   - order (Unique)
   - createdAt, updatedAt

3. **ChapterContent**
   - id (Primary Key)
   - chapterId (Foreign Key)
   - topic
   - content (Text)
   - order
   - createdAt, updatedAt

4. **MCQ**
   - id (Primary Key)
   - chapterId (Foreign Key)
   - question (Text)
   - optionA, optionB, optionC, optionD
   - correctOption (A, B, C, or D)
   - explanation (Text)
   - difficulty (easy, medium, hard)
   - order
   - createdAt, updatedAt

5. **AssessmentSession**
   - id (Primary Key)
   - userId (Foreign Key)
   - chapterId
   - startedAt
   - submittedAt (Nullable)
   - duration (Seconds)
   - totalQuestions
   - correctAnswers
   - score (Percentage)
   - percentage
   - accuracy

6. **StudentAnswer**
   - id (Primary Key)
   - assessmentSessionId (Foreign Key)
   - userId (Foreign Key)
   - mcqId (Foreign Key)
   - selectedOption (A, B, C, D, or null)
   - isCorrect (Boolean)
   - createdAt, updatedAt

7. **PerformanceMetrics**
   - id (Primary Key)
   - userId
   - chapterId
   - totalAttempts
   - totalScore
   - averageScore
   - averageAccuracy
   - bestScore
   - correctAnswers
   - incorrectAnswers
   - skippedQuestions
   - completionStatus
   - lastAttemptAt
   - createdAt, updatedAt

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login student

### Chapters
- `GET /api/chapters` - List all chapters
- `GET /api/chapters/[id]` - Get chapter details with content and MCQs

### Assessments
- `POST /api/assessments/start` - Start new assessment session
- `POST /api/assessments/save-answer` - Save student answer with auto-save
- `POST /api/assessments/submit` - Submit assessment and calculate results

### Dashboard
- `GET /api/dashboard` - Fetch overall performance metrics

## Setup and Installation

### Prerequisites
- Node.js 18+ (with npm or yarn)
- PostgreSQL 12+
- Git

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd alfanumrik
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` and configure:
```
DATABASE_URL="postgresql://username:password@localhost:5432/alfanumrik"
JWT_SECRET="your-secure-jwt-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Step 4: Set Up PostgreSQL Database
```bash
# Create database
createdb alfanumrik

# Alternative if using pgAdmin or another tool:
# Create a database named 'alfanumrik'
```

### Step 5: Run Prisma Migrations
```bash
npx prisma migrate dev --name init
```

This will:
1. Create all database tables based on the schema
2. Generate Prisma Client

### Step 6: Seed Database with Sample Data
```bash
npx prisma db seed
```

This will populate the database with:
- 1 Sample chapter (Class 10 Science - Life Processes)
- 4 Learning topics
- 20 MCQ questions with explanations

### Step 7: Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### For Students

1. **Register/Login**
   - Go to `http://localhost:3000`
   - Click "Register" to create new account
   - Enter email, full name, and password
   - Login with credentials

2. **Browse Chapters**
   - Navigate to "Chapters" page
   - Select a chapter to start learning
   - View chapter content, topics, and revision notes

3. **Take Assessment**
   - On chapter detail page, click "Start Assessment"
   - Answer 20 MCQs within 30 minutes
   - Use Next/Previous buttons to navigate
   - Questions auto-save as you answer
   - Review your answers anytime using the question panel

4. **View Results**
   - After submission, see your performance metrics
   - View percentage, accuracy, and time taken
   - Check correct/incorrect/skipped answer breakdown

5. **Monitor Progress**
   - Go to Dashboard to view overall statistics
   - See chapter-wise performance breakdown
   - Track your learning progress over time

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run TypeScript linter
npm run lint

# Prisma utilities
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Create and run migrations
npx prisma studio       # Open Prisma Studio UI
npx prisma db seed      # Seed database
```

### Add New Chapter

You can add new chapters by:
1. Using Prisma Studio: `npx prisma studio`
2. Running a custom seed script
3. Using API endpoints (if admin endpoints are implemented)

### Customize MCQs

Edit the seed data in `prisma/seed.ts` to add more questions or chapters.

## Production Deployment

### Frontend (Vercel)
```bash
# Push to GitHub
git push origin main

# Connect repository in Vercel dashboard
# Vercel will auto-deploy on every push
```

### Backend and Database
- Deploy to any Node.js hosting (Heroku, Railway, Render, AWS)
- Configure environment variables
- Set up PostgreSQL database (use managed service)
- Run migrations on production: `npx prisma migrate deploy`

## Security Considerations

1. **Environment Variables**: Keep `.env.local` private, never commit it
2. **JWT Secret**: Use a strong, random secret in production
3. **Database**: Use secure passwords and proper access controls
4. **HTTPS**: Always use HTTPS in production
5. **Password Hashing**: Passwords are hashed with bcryptjs (10 salt rounds)
6. **Token Expiration**: JWT tokens expire in 7 days

## Future Enhancements

- [ ] Admin dashboard for managing chapters and MCQs
- [ ] Real-time progress tracking with websockets
- [ ] Performance analytics and data visualization
- [ ] Social features (peer comparison, leaderboards)
- [ ] Multiple choice test generation
- [ ] Video content integration
- [ ] Mobile app (React Native)
- [ ] Two-factor authentication
- [ ] Content recommendation engine

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
# Reset database
npx prisma migrate reset

# Verify DATABASE_URL format
# postgresql://username:password@host:port/database
```

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### Prisma Client Issues
```bash
# Regenerate Prisma Client
npx prisma generate
```

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - feel free to use this project for educational purposes.

## Support

For issues or questions:
1. Check the GitHub issues
2. Consult the Prisma documentation
3. Review Next.js docs

## Contact

For questions or feedback about this project, please open an issue in the repository.

---

**Happy Learning! 📚**
