# Alfanumrik – Chapter Learning & Assessment Module

A full-stack educational platform built as part of the Alfanumrik technical assessment. Students can study chapter content, take MCQ assessments, and track their performance on a personal dashboard.

**Live Application:** https://alfanumrik-rakhee.vercel.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Next.js API Routes (serverless) |
| Database | PostgreSQL (Neon) + Prisma ORM |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Deployment | Vercel (app) + Neon (database) |

---

## Features

- Student registration and login with JWT authentication
- Chapter browser with subject-wise filtering
- Topic-wise study pages with key concepts and revision notes
- MCQ assessment with timer, auto-save, and navigation
- Score calculation — marks, percentage, accuracy
- Student dashboard with full attempt history
- Fully responsive and mobile-compatible UI

---

## Local Setup Instructions

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- A PostgreSQL database (Neon free tier recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/RakheeSharma17082005/alfanumrik-rakhee.git
cd alfanumrik-rakhee
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://username:password@host:5432/dbname?sslmode=require"
JWT_SECRET="your-32-character-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

To generate a JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Set Up the Database

Push the Prisma schema to your database:
```bash
npx prisma db push
```

Seed the database with chapters and MCQs:
```bash
npx prisma db seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 6. (Optional) Open Prisma Studio

```bash
npx prisma studio
```

Opens a visual database browser at http://localhost:5555.

---

## Demo Credentials

| Field | Value |
|---|---|
| Email | demo@alfanumrik.com |
| Password | Student@123 |

---

## Project Structure

```
alfanumrik-rakhee/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   └── login/route.ts
│   │   ├── chapters/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── assessments/
│   │   │   ├── start/route.ts
│   │   │   ├── save-answer/route.ts
│   │   │   ├── submit/route.ts
│   │   │   └── [id]/route.ts
│   │   └── dashboard/route.ts
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── chapters/page.tsx
│   ├── chapters/[subject]/page.tsx
│   ├── chapters/[subject]/[chapterId]/page.tsx
│   ├── assessment/[id]/page.tsx
│   ├── results/[id]/page.tsx
│   ├── dashboard/page.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── validation.ts
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── seed_comprehensive.ts
├── .env
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to vercel.com → Import project
3. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_API_URL`
4. Click Deploy

### Database (Neon)

1. Create a free project at neon.tech
2. Copy the connection string
3. Run `npx prisma db push` with the production DATABASE_URL
4. Run seed script to populate data

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed the database |
