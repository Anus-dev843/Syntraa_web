# The Syntraa Web

Production-ready Next.js storefront + secure admin dashboard.

## Tech Stack

- Next.js App Router (`src/app`)
- React + TypeScript
- Tailwind CSS
- Framer Motion
- File-backed admin store (`src/data/admin-store.json`)

## Project Structure

```text
.
├── config/
│   └── runtime.mjs           # Runtime helpers (PORT/HOST)
├── data/
│   ├── products.js           # Seed product catalog
│   └── products.d.ts
├── public/
├── src/
│   ├── app/                  # App Router pages, layouts, API routes
│   ├── components/           # UI and feature components
│   ├── context/              # React context providers
│   ├── data/                 # Runtime/admin JSON + static datasets
│   └── lib/                  # Domain logic + utilities
├── src/middleware.ts         # Admin/auth route protection
├── server.mjs                # Production entrypoint (uses process.env.PORT)
└── package.json
```

## Scripts

- `npm run dev` – Local development
- `npm run build` – Production build
- `npm run start` – Production server (`server.js`)
- `npm run lint` – ESLint
- `npm run typecheck` – TypeScript check

## Local Run

```bash
npm install
npm run build
npm start
```

Server binds to:

- `process.env.PORT` (fallback `3000`)
- `process.env.HOST` (fallback `0.0.0.0`)

## Render Deployment

This repo includes `render.yaml` with:

- `buildCommand: npm install && npm run build`
- `startCommand: npm start`

Compatible with Render web services out of the box.
