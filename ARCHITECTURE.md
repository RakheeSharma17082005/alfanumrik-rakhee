# Architecture Overview
## Alfanumrik – Chapter Learning & Assessment Module

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                    │
│         Next.js App Router + Tailwind CSS UI             │
│   Pages: /, /auth, /chapters, /assessment, /dashboard   │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS requests
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   VERCEL (Serverless)                    │
│                                                          │
│   ┌──────────────────────────────────────────────────┐  │
│   │              Next.js API Routes                  │  │
│   │                                                  │  │
│   │  /api/auth/register    /api/auth/login           │  │
│   │  /api/chapters         /api/chapters/[id]        │  │
│   │  /api/assessments/*    /api/dashboard            │  │
│   └──────────────────────┬───────────────────────────┘  │
│                          │ Prisma ORM                    │
└──────────────────────────┼──────────────────────────────┘
                           │ PostgreSQL connection
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  NEON (PostgreSQL Cloud)                 │
│                                                          │
│   Users │ Chapters │ ChapterContent │ MCQs              │
│   AssessmentSessions │ StudentAnswers │ Results          │
└─────────────────────────────────────────────────────────┘
```

---

## Key Architectural Decisions

### 1. Next.js Monorepo (App Router)
Frontend and backend live in the same codebase. API routes are serverless functions co-located with pages. This simplifies deployment — one Vercel project handles everything.

### 2. JWT Authentication (Stateless)
No sessions stored in the database. A JWT token is issued at login/register, stored in localStorage, and sent with every request via the Authorization header. The server verifies the token on every protected route.

### 3. Prisma ORM
Prisma provides type-safe database access, automatic query building, and easy schema migrations. The Prisma client is initialized as a singleton to avoid connection pool exhaustion in serverless environments.

### 4. Serverless-Compatible Prisma Setup
```typescript
// lib/prisma.ts
const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```
This pattern reuses the Prisma client across hot reloads in development and across serverless function invocations.

### 5. Neon Serverless PostgreSQL
Neon provides a serverless PostgreSQL database with connection pooling built in. It scales to zero when idle and wakes on demand — perfect for a Vercel deployment.

---

## Request Flow

### Authentication Flow
```
Client → POST /api/auth/register
       → Validate input (Zod)
       → Hash password (bcrypt)
       → Store user in DB (Prisma)
       → Generate JWT token
       → Return token to client
       → Client stores token in localStorage
```

### Protected Request Flow
```
Client → GET /api/chapters
       → Read Authorization header
       → Verify JWT token
       → Extract userId from token
       → Query database
       → Return data
```

### Assessment Flow
```
Client → POST /api/assessments/start
       → Create AssessmentSession in DB
       → Return sessionId

During exam:
Client → POST /api/assessments/save-answer (per question)
       → Upsert StudentAnswer in DB

On submit:
Client → POST /api/assessments/submit
       → Fetch all StudentAnswers for session
       → Compare with correct answers in MCQ table
       → Calculate: score, percentage, accuracy
       → Store Result in DB
       → Return result to client
```

---

## Folder Structure

```
app/
├── api/                    ← Backend (serverless API routes)
│   ├── auth/
│   ├── chapters/
│   ├── assessments/
│   └── dashboard/
├── auth/                   ← Auth pages (login, register)
├── chapters/               ← Chapter browsing & study pages
├── assessment/             ← MCQ exam interface
├── results/                ← Post-exam results page
└── dashboard/              ← Student performance dashboard

lib/
├── auth.ts                 ← JWT generate/verify helpers
├── prisma.ts               ← Prisma singleton client
└── validation.ts           ← Zod input validation schemas

prisma/
├── schema.prisma           ← Database schema
└── seed.ts                 ← Database seeding script
```

---

## Security Practices

| Practice | Implementation |
|---|---|
| Password hashing | bcryptjs with salt rounds = 10 |
| JWT expiry | Tokens expire after 7 days |
| Input validation | Zod schema validation on all API inputs |
| SQL injection | Prevented by Prisma's parameterized queries |
| Sensitive data | Passwords never returned in API responses |
| Environment secrets | All secrets in environment variables, never in code |

---

## Deployment Architecture

```
GitHub (main branch)
        │
        │ push triggers
        ▼
   Vercel CI/CD
        │
        │ runs: prisma generate && next build
        ▼
   Vercel Production
   ├── Static pages (CDN cached)
   └── API Routes (serverless functions)
              │
              │ DATABASE_URL env var
              ▼
         Neon PostgreSQL
```

Every push to `main` triggers an automatic redeploy on Vercel. Environment variables are managed in Vercel's dashboard and injected at build and runtime.
