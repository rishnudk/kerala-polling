# Kerala Poll — Project Brief & Agent Context Document

## 1. What I Am Building

A **web-based election opinion poll** for Kerala, India.

This is NOT an official election system.
This is a public survey tool — like a straw poll — where anyone can
express their voting preference for their constituency.

Think of it like: "If elections were held today, who would you vote for
in your mandalam?"

---

## 2. Core User Journey

```
User opens the app
       ↓
Sees a clickable map of Kerala
       ↓
Clicks their district  (e.g. Kannur)
       ↓
Selects their constituency / mandalam  (e.g. Dharmadom)
       ↓
Sees the candidates / parties available:
   [ UDF ]   [ LDF ]   [ NDA ]   [ IND ]
       ↓
Clicks one party to vote
       ↓
Sees live results for that constituency as a bar chart
(what % of poll respondents chose each party)
```

---

## 3. Anti-Duplicate Voting Strategy (No Login Required)

Users do NOT register or log in. To prevent the same person voting
multiple times, we use 3 layers:

| Layer | Method | Where |
|-------|--------|--------|
| 1 | localStorage flag — voted_{constituency} stored in browser | Frontend |
| 2 | Browser fingerprint — hashed device ID using FingerprintJS | Frontend + Backend |
| 3 | IP rate limit — 1 vote per IP per constituency per 24 hours | Backend (Redis) |
| DB | @@unique([fingerprintHash, constituency]) constraint | PostgreSQL (Prisma) |

The fingerprint and IP are always SHA-256 hashed before storing.
Raw IPs and fingerprints are never saved to the database.

---

## 4. Tech Stack

### Framework
- Next.js 16 with App Router
- TypeScript
- Tailwind CSS

### Backend (inside Next.js — no separate server)
- Next.js Route Handlers in app/api/
- Prisma ORM v7 with @prisma/adapter-pg
- PostgreSQL via Supabase (free tier)
- Redis via Upstash (free tier) — for IP rate limiting
- Zod — for API input validation

### Frontend
- React 18 (Server + Client components)
- FingerprintJS — device fingerprint without login
- Recharts — bar chart for live results
- Supabase Realtime — live vote updates (no Socket.io, incompatible with Vercel)

### Deployment
- Vercel (frontend + API routes as serverless functions)
- Supabase (managed PostgreSQL + Realtime)
- Upstash (managed Redis)

---

## 5. Project Folder Structure

```
kerala-poll/
├── app/
│   ├── api/
│   │   ├── vote/
│   │   │   └── route.ts          POST — cast vote / GET — check status
│   │   └── vote/
│   │       └── results/
│   │           └── route.ts      GET — aggregated vote counts
│   ├── (poll)/
│   │   ├── layout.tsx            shared header + step indicator
│   │   ├── page.tsx              / — Kerala map + district selector
│   │   ├── vote/
│   │   │   └── page.tsx          /vote — party selection
│   │   └── results/
│   │       └── [constituency]/
│   │           └── page.tsx      /results/:name — live chart
│   ├── layout.tsx                root layout
│   └── globals.css
│
├── components/
│   ├── map/
│   │   └── KeralaMap.tsx         'use client' — SVG map of Kerala
│   ├── poll/
│   │   ├── ConstituencySelector.tsx
│   │   ├── PartyCard.tsx
│   │   ├── VoteButton.tsx
│   │   └── AlreadyVotedBanner.tsx
│   ├── results/
│   │   ├── ResultsChart.tsx      'use client' — Recharts
│   │   └── LiveBadge.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── StepIndicator.tsx
│
├── lib/
│   ├── prisma.ts                 Prisma client with PrismaPg adapter
│   ├── redis.ts                  Upstash Redis client
│   ├── hash.ts                   SHA-256 helper
│   ├── rateLimiter.ts            Redis INCR + EXPIRE pattern
│   └── validators.ts             Zod schemas
│
├── hooks/
│   ├── useFingerprint.ts         FingerprintJS loader
│   ├── useVoteStatus.ts          localStorage + server check
│   └── useLiveResults.ts         Supabase Realtime subscription
│
├── data/
│   ├── districts.ts              14 Kerala districts
│   ├── constituencies.ts         140 mandalams keyed by district
│   └── parties.ts                UDF / LDF / NDA / IND with colors
│
├── types/
│   └── index.ts                  shared TypeScript types
│
├── prisma/
│   ├── schema.prisma             Vote model
│   └── migrations/
│
├── prisma.config.ts              Prisma v7 config (adapter-pg)
├── .env                          DATABASE_URL (for Prisma CLI)
├── .env.local                    all secrets (for Next.js runtime)
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 6. Database Schema

```prisma
model Vote {
  id              String   @id @default(uuid())
  constituency    String                         -- e.g. "Dharmadom"
  district        String                         -- e.g. "Kannur"
  party           String                         -- "UDF"|"LDF"|"NDA"|"IND"
  fingerprintHash String                         -- SHA-256 of device fingerprint
  ipHash          String                         -- SHA-256 of client IP

  createdAt       DateTime @default(now())

  @@unique([fingerprintHash, constituency])      -- one vote per device per seat
  @@index([constituency])                        -- fast results queries
}
```

---

## 7. API Endpoints

### POST /api/vote
Cast a vote.

Request body:
```json
{
  "constituency": "Dharmadom",
  "district":     "Kannur",
  "party":        "LDF",
  "fingerprint":  "raw-device-id-from-fingerprintjs"
}
```

Logic flow:
1. Validate with Zod
2. Hash IP and fingerprint with SHA-256 + HASH_SALT
3. Check Redis rate limit (1 vote / IP / constituency / 24h)
4. prisma.vote.create() — @@unique constraint blocks duplicates
5. Return 201 success or 409 conflict

Response (success):
```json
{ "success": true, "voteId": "uuid" }
```

Error responses:
- 400 — invalid input
- 409 — already voted (fingerprint duplicate)
- 429 — rate limited (IP duplicate)
- 500 — server error

---

### GET /api/vote?constituency=X&fingerprint=Y
Check if this device has already voted in a constituency.

Response:
```json
{
  "voted":   true,
  "party":   "LDF",
  "votedAt": "2024-01-15T10:30:00Z"
}
```

---

### GET /api/vote/results?constituency=X
Get aggregated vote counts for a constituency.

Response:
```json
{
  "constituency": "Dharmadom",
  "results": {
    "UDF": 42,
    "LDF": 87,
    "NDA": 23,
    "IND": 8
  },
  "total": 160
}
```

Cache-Control: public, s-maxage=10, stale-while-revalidate=30

---

## 8. Key Implementation Details

### Prisma v7 — Important Breaking Change
Prisma v7 removed `url` from `schema.prisma`.
Connection is now via adapter in `prisma.config.ts` and `lib/prisma.ts`.

prisma/schema.prisma — NO url field:
```prisma
datasource db {
  provider = "postgresql"
}
```

lib/prisma.ts — adapter pattern:
```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter, log: ["error"] });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

### Socket.io — NOT used
Vercel is serverless. Socket.io requires a persistent server.
Use Supabase Realtime instead for live vote updates.

### Environment Variables
Two files needed:
- `.env`       → DATABASE_URL only (Prisma CLI reads this)
- `.env.local` → all variables (Next.js runtime reads this)

Required variables:
```
DATABASE_URL                    postgresql://...supabase.co.../postgres?sslmode=require
REDIS_URL                       https://xxxx.upstash.io
REDIS_TOKEN                     upstash token
NEXT_PUBLIC_SUPABASE_URL        https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY   supabase anon key
HASH_SALT                       any random secret string
```

---

## 9. Kerala Geography Data

- 14 districts
- ~140 constituencies (mandalams) total
- Each constituency belongs to exactly one district

Districts:
Thiruvananthapuram, Kollam, Pathanamthitta, Alappuzha, Kottayam,
Idukki, Ernakulam, Thrissur, Palakkad, Malappuram, Kozhikode,
Wayanad, Kannur, Kasaragod

Parties in the poll:
- UDF — United Democratic Front (Congress-led, blue)
- LDF — Left Democratic Front (CPI-M led, red)
- NDA — National Democratic Alliance (BJP-led, orange)
- IND — Independent / Others (gray)

---

## 10. Current Project Status

### Done
- [x] Next.js project created with TypeScript + Tailwind
- [x] All dependencies installed
- [x] Prisma v7 configured with adapter-pg
- [x] Database schema defined
- [x] API route POST /api/vote written
- [x] API route GET /api/vote written
- [x] API route GET /api/vote/results written
- [x] lib/prisma.ts with adapter pattern
- [x] lib/hash.ts
- [x] lib/rateLimiter.ts
- [x] Prisma db push successful
- [x] API tested in Postman

### In Progress / TODO
- [ ] Kerala SVG map component (KeralaMap.tsx)
- [ ] Home page — map + district/constituency selector
- [ ] Vote page — party cards + submit button
- [ ] Results page — bar chart with live updates
- [ ] useFingerprint hook
- [ ] useVoteStatus hook (localStorage + server check)
- [ ] useLiveResults hook (Supabase Realtime)
- [ ] AlreadyVotedBanner component
- [ ] Deploy to Vercel

---

## 11. Design Guidelines

- Clean, minimal UI
- Mobile-first (most Kerala users are on mobile)
- Kerala government green (#1D9E75) as primary accent color
- Show a 3-step progress indicator: Select → Vote → Results
- Results page shows a horizontal bar chart per party
- No login screens, no forms asking for personal info
- Language: English (Malayalam support optional later)

---

## 12. Packages Installed

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "typescript": "^5",
    "tailwindcss": "^3",
    "@prisma/client": "^7",
    "@prisma/adapter-pg": "^7",
    "pg": "^8",
    "zod": "^3",
    "@upstash/redis": "^1",
    "@fingerprintjs/fingerprintjs": "^4",
    "recharts": "^2",
    "@supabase/supabase-js": "^2"
  },
  "devDependencies": {
    "prisma": "^7",
    "@types/pg": "^8"
  }
}
```

---

## How to Use This Document with an AI Agent

Start your chat with:

"I am building a Kerala election poll web app. Here is the full project
context — please read it before we begin:"

Then paste this entire document.

The agent now knows:
- What you are building and why
- The complete folder structure
- Every API endpoint and its exact request/response format
- The database schema
- The tech stack and all known gotchas (Prisma v7, no Socket.io)
- What is done and what still needs to be built
- The design guidelines

Update the "Current Status" section (Section 10) as you complete tasks.