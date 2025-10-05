# SAM LMS - Learning Management System

SAM LMS is a production-ready learning platform for saml.co.za that combines a Vite-powered React frontend with an Express + TypeScript backend. It features BetterAuth for secure authentication, Paystack for regional payments, Resend for transactional email, and Africa's Talking for SMS delivery.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)
- [Acknowledgments](#acknowledgments)

## Features

- **BetterAuth integration** with email + Google/GitHub OAuth flows, password reset, and session-aware routing
- **Course catalogue** with modules, lessons, instructor bios, and live pricing pulled from the backend
- **Enrollment + Paystack checkout** that redirects authenticated learners into payment or their dashboard
- **Progress-ready data model** with enrollment tracking, Redis-backed session storage, and PostgreSQL persistence
- **Operational notifications** via Resend email templates and Africa's Talking SMS hooks
- **Admin foundations** for securing protected routes and extending account management in future iterations

## Architecture

### Frontend (React + Vite)
- **React 19** with **React Router** for client-side routing
- **Tailwind CSS** + **Radix UI** component primitives
- **BetterAuth client** hooks for auth session management
- **Vite** dev/build tooling with ESLint for quality gates

### Backend (Express + TypeScript)
- **Express 5** API with modular routing and controller layers
- **BetterAuth server** handlers with Resend + OAuth providers
- **PostgreSQL** via the `pg` driver for relational storage
- **Redis** for session caching and rate-limiting extensions
- **Axios** utilities for service-to-service calls (Paystack, etc.)

### Platform Integrations
- **Paystack** for multi-currency payments (NGN, GHS, KES, ZAR)
- **Resend** for transactional emails (verification, password reset)
- **Africa's Talking** for SMS notifications

## Project Structure

```
sam-lms/
├── frontend/              # React + Vite single-page application
├── backend/               # Express + TypeScript API
│   ├── src/
│   │   ├── config/       # Environment + auth configuration
│   │   ├── controllers/  # HTTP handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API route definitions
│   │   ├── services/     # Business logic helpers
│   │   ├── types/        # Shared TypeScript types
│   │   └── utils/        # Utility functions (email, payments, etc.)
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── infrastructure/        # Database schema + IaC stubs
├── docs/                  # Additional documentation
├── .github/workflows/     # CI/CD pipelines
├── package.json           # npm workspaces root
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js 18+** (or compatible LTS)
- **npm 9+** (or pnpm 10+ if you prefer)
- **PostgreSQL 14+**
- **Redis 6+**
- **Git**
- **Docker** (optional for container-based setups)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sudz/sam-lms.git
   cd sam-lms
   ```

2. **Install dependencies** (workspace-aware)

   ```bash
   npm install   # installs root, backend, and frontend workspaces
   ```

   > Prefer `pnpm install` if you manage dependencies with pnpm.

3. **Bootstrap environment variables**

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```

   Update the placeholders with your credentials:

   ```env
   # backend/.env
   NODE_ENV=development
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   SITE_URL=http://localhost:3000
   DATABASE_URL=postgresql://user:password@host:5432/database
   BETTERAUTH_SECRET=change_me_to_32_chars_min
   BETTERAUTH_EMAIL_FROM=no-reply@saml.co.za
   PAYSTACK_SECRET_KEY=sk_test_xxx
   PAYSTACK_PUBLIC_KEY=pk_test_xxx
   PAYSTACK_WEBHOOK_SECRET=whsec_xxx
   AFRICASTALKING_USERNAME=sandbox
   AFRICASTALKING_API_KEY=at_api_key
   AFRICASTALKING_SENDER_ID=SAM LMS
   RESEND_API_KEY=re_api_key
   REDIS_URL=redis://localhost:6379
   ```

   ```env
   # frontend/.env.local
   VITE_API_URL=http://localhost:3001/api
   VITE_BETTERAUTH_URL=http://localhost:3001/auth
   # NEXT_PUBLIC_* variables are kept for backwards compatibility with legacy builds
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_BETTERAUTH_URL=http://localhost:3001/auth
   ```

4. **Provision the database schema**

   ```bash
   psql "$DATABASE_URL" -f infrastructure/database/schema.sql
   ```

## Development

### Backend API

```bash
cd backend
npm run dev
```

The API listens on `http://localhost:3001` and exposes `/auth` (BetterAuth) and `/api` routes.

### Frontend SPA

```bash
cd frontend
npm run dev
```

Vite serves the React app on `http://localhost:3000` with hot-module reloading.

### Quality Checks

- **Frontend linting**: `npm run lint` (inside `frontend/`)
- **Backend type-check**: `npm run build` (inside `backend/`)
- Add automated tests as they come online (`npm test` placeholders exist today).

## Deployment

1. Build both workspaces:

   ```bash
   cd backend && npm run build
   cd ../frontend && npm run build
   ```

2. Push artifacts to your hosting targets (e.g., AWS EC2 for API, S3/CloudFront or Vercel/Netlify for SPA).

3. Configure environment variables in your hosting provider, matching the `.env` templates.

4. Wire Paystack webhooks to `/api/payments/webhook` and ensure BetterAuth callback URLs match deployed domains.

> Refer to `docs/` for infrastructure automation patterns (Terraform, GitHub Actions) as they evolve.

## API Documentation

During development the backend serves OpenAPI docs at `http://localhost:3001/api/docs` once the swagger middleware is enabled.

## Contributing

1. Fork the repository and create a feature branch.
2. Make your changes and ensure `npm run lint` (frontend) / `npm run build` (backend) succeed.
3. Commit with a conventional message and open a Pull Request.

## License

Licensed under the ISC License. See [LICENSE](LICENSE) for details.

## Support

Open a GitHub issue for bugs, feature requests, or deployment questions.

## Acknowledgments

- [BetterAuth](https://github.com/better-auth/better-auth)
- [Paystack](https://paystack.com/)
- [Africa's Talking](https://africastalking.com/)
- [Resend](https://resend.com/)
- [Amazon Web Services](https://aws.amazon.com/)

---

**Built with passion for African learners — https://saml.co.za/**
