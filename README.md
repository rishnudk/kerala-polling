# Kerala Polling

A web-based election opinion poll for Kerala, India. This is a public survey tool designed to capture voting preferences across various constituencies using a simple, interactive interface.

## 🚀 Key Features

- **Interactive Map**: Navigate through Kerala's districts and constituencies using a clickable SVG map.
- **Anti-Duplicate Voting**: Multi-layered protection to ensure fair polling without requiring user login:
  - LocalStorage flags for immediate feedback.
  - Device fingerprinting via FingerprintJS.
  - IP-based rate limiting using Upstash Redis.
- **Live Results**: Real-time aggregated vote counts visualized with interactive bar charts (Recharts).
- **Responsive Design**: Mobile-first UI styled with Tailwind CSS 4 and modern aesthetics.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Supabase) with [Prisma 7](https://www.prisma.io/)
- **Cache/Rate Limit**: [Upstash Redis](https://upstash.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Realtime**: [Supabase Realtime](https://supabase.com/docs/guides/realtime) for live updates.

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase account (PostgreSQL + Realtime)
- Upstash account (Redis)

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
DATABASE_URL="postgresql://..."
REDIS_URL="https://..."
REDIS_TOKEN="..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
HASH_SALT="your-random-secret"
```

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Synchronize the database schema:
   ```bash
   npx prisma db push
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

- `app/`: Application routes, layouts, and API endpoints.
- `component/`: Reusable UI and visualization components.
- `data/`: Geographic data (districts/constituencies) and party information.
- `hooks/`: Custom hooks for fingerprinting, polling status, and live results.
- `lib/`: Shared utilities for database, cache, and hashing.
- `prisma/`: Prisma schema and database configuration.
- `public/`: Static assets.

---
*Disclaimer: This is an opinion poll tool and not an official election system.*
