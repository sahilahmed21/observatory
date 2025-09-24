Axon (Observatory) - Real-Time API Performance Observatory
A comprehensive, full-stack monitoring platform designed to track API performance across distributed systems. Axon provides engineering teams with instant insights into latency, error rates, and bottlenecks, helping them resolve issues before they impact users.

## ✨ Features
Axon is built with a rich feature set that provides a complete, end-to-end monitoring and alerting experience.

- **Real-Time Dashboard**
  - Live-updating time-series charts for API latency
  - KPIs: Average, P95, and P99 latency
  - Apdex score for user satisfaction
  - Success and error rates
  - Interactive status code pie chart (2xx, 4xx, 5xx)
  - Detailed endpoint performance table

- **Intelligent Alerting**
  - Create custom rules (e.g., "latency > 500ms for 5 minutes")
  - Background worker powered by BullMQ
  - Real-time email notifications (Nodemailer + Ethereal for dev)

- **Monitoring Agent**
  - Lightweight npm package for Node.js/Express apps (`observatory-agent`)
  - High-precision timings and efficient batching
  - Secure API key authentication

- **Secure Authentication**
  - JWT-based user authentication
  - API Key for agent-to-server metrics ingestion

- **Modern UI/UX**
  - Next.js app with shadcn/ui + Aceternity UI
  - Polished UX with skeletons, toasts, and dynamic layouts

## 💻 Tech Stack
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts, TanStack Query, Zustand, WebSockets
- **Backend**: Node.js, Express, TypeScript, Prisma, BullMQ, WebSocket
- **Datastores**: PostgreSQL, Redis
- **Infra**: Docker + Docker Compose
- **Agent**: TypeScript npm package

## 📦 Monorepo Structure
The project is organized as a monorepo with four primary packages:

observatory/
├── agent/           # Lightweight npm package for monitoring user apps (observatory-agent)
├── backend/         # Express + Prisma API server and background worker
├── frontend/        # Next.js dashboard application
├── sampleApp/       # Simple Express app for testing the agent
└── docker-compose.yml

## 🚀 Getting Started
Follow these steps to run the entire platform locally.

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- npm (or pnpm/yarn if you prefer; commands below use npm)

### 1) Install Dependencies
From the repo root:

```bash
# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..

# Agent
cd agent && npm install && cd ..

# Sample app
cd sampleApp && npm install && cd ..
```

### 2) Configure Environment Variables (Backend)
Create a `.env` file in `backend/` (use values below as a starting point):

```bash
# backend/.env
DATABASE_URL="postgresql://admin:password@localhost:5432/observatory"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key"

# Ethereal Email Credentials (optional for testing alerts)
EMAIL_HOST="smtp.ethereal.email"
EMAIL_PORT=587
EMAIL_USER="your-ethereal-user@ethereal.email"
EMAIL_PASS="your-ethereal-password"
```

### 3) Start Infrastructure (Postgres + Redis)
From the repo root:

```bash
docker-compose up -d
```

### 4) Build and Link the Agent (optional, for local development)
```bash
cd agent
npm run build
npm link
```

Then link it in the sample app:

```bash
cd ../sampleApp
npm link observatory-agent
```

### 5) Start the Backend (API + Worker)
Open two terminals from `backend/`:

```bash
# Terminal A - API server
yarn dev # or: npm run dev

# Terminal B - background worker
yarn worker # or: npm run worker
```

Scripts (from `backend/package.json`):
- `dev`: nodemon + ts-node for `src/index.ts`
- `worker`: ts-node for `src/worker.ts`

### 6) Start the Frontend
From `frontend/`:

```bash
npm run dev
```

Then open `http://localhost:3000`.

### 7) Run the Sample App (to generate metrics)
Update `sampleApp/index.js` with a valid API key (create a Project in the UI to obtain one), then start the app:

```bash
cd sampleApp
node index.js
```

Generate traffic in another terminal to see data flow into the dashboard:

```bash
curl http://localhost:4000/api/users
```

## 🔑 Where to Get the API Key
- Sign up / log in on the frontend at `http://localhost:3000`
- Create a Project in the dashboard
- Copy the Project’s API Key and configure it in the agent (or in `sampleApp/index.js`)

## 🧩 Agent Usage (in your own app)
Install from your local build or (in future) via npm:

```bash
npm install observatory-agent
# or if using local link:
npm link observatory-agent
```

Basic Express integration example:

```js
const express = require('express');
const { createObservatoryAgent } = require('observatory-agent');

const app = express();

const agent = createObservatoryAgent({
  apiKey: process.env.OBSERVATORY_API_KEY, // from your Project settings
  endpoint: 'http://localhost:8080',       // backend API base URL
});

app.use(agent.expressMiddleware());

app.get('/api/users', async (req, res) => {
  res.json({ ok: true });
});

app.listen(4000, () => console.log('Sample app on :4000'));
```

## 🧪 Development Tips
- **Database Migrations**: Prisma migrations live in `backend/prisma/`. Typical commands:
  - `npx prisma migrate dev` (during development)
  - `npx prisma generate` (after schema changes)
- **Seeding Data**: If you add a seed script, document it here (e.g., `npm run seed`).
- **Environment Management**: Keep `.env` only in `backend/`. Frontend typically consumes the backend without secret envs.
- **Networking**: The backend likely runs on `http://localhost:8080` (check `backend/src/index.ts`). The frontend expects that base URL; update if you change ports.
- **Emails**: Ethereal is recommended for local testing (open generated preview URLs in logs).

## 🧯 Troubleshooting
- **Backend cannot connect to Postgres/Redis**
  - Ensure `docker-compose up -d` is running and containers are healthy
  - Check `DATABASE_URL` and `REDIS_URL` in `backend/.env`
- **Migrations fail**
  - Run `npx prisma migrate dev` in `backend/`
  - Verify the database container is reachable on port 5432
- **Frontend shows no data**
  - Confirm backend is running and reachable
  - Open browser devtools Network tab for failing requests
  - Check WebSocket endpoint configuration
- **Agent metrics not appearing**
  - Verify the Project API Key is correct
  - Confirm the agent’s endpoint points to your backend
  - Check server logs for API key auth failures
- **Emails not received**
  - Use Ethereal credentials; inspect logs for preview URLs

## 📚 Scripts Reference
- **backend**
  - `npm run dev` — start API server (ts-node + nodemon)
  - `npm run worker` — start background worker
  - `npm run build` — compile TypeScript
- **frontend**
  - `npm run dev` — start Next.js dev server
  - `npm run build` — build production assets
  - `npm start` — start Next.js in production mode
- **agent**
  - `npm run build` — compile TypeScript

## 📄 License
MIT (c) 2025. See `LICENSE` if present.

