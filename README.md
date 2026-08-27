# SAM LMS — Smart African Learning Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0%2B-blue.svg)
![React](https://img.shields.io/badge/react-18%2B-blue.svg)

> An open-source learning platform concept shaped around African education: local integrations, privacy-conscious data handling, and the realities of uneven connectivity.

**Project site:** [saml.co.za](https://saml.co.za/) · **Roadmap:** [ROADMAP.md](ROADMAP.md) · **Security:** [SECURITY.md](SECURITY.md) · **Issues:** [GitHub Issues](https://github.com/Sudz/sam-lms/issues)

## Why this project exists

Many education platforms assume stable connectivity, international payment systems, and uniform infrastructure. SAM LMS explores a more locally grounded approach for South African educators and learners, with room for offline-first curriculum, local payment and messaging workflows, and responsible handling of learner data.

## My role

This is a personally owned full-stack project. I have used it to design and connect the product structure, frontend and backend boundaries, database schema and migrations, authentication, local service integrations, deployment configuration, documentation, security guidance, issue templates, and development automation. The repository history currently contains 96 commits, with the implementation and roadmap evolving over time.

## What the repository demonstrates

| Area | Evidence in this repository |
|---|---|
| Product and domain thinking | African education workflows, curriculum structure, learner-facing flows, and a public roadmap |
| Full-stack engineering | React and TypeScript frontend with a Node.js/TypeScript backend |
| Data and infrastructure | PostgreSQL, Supabase migrations, database schema, infrastructure configuration, and environment setup |
| Integrations | Better Auth, Paystack, Africa’s Talking, Resend, and AWS configuration |
| Delivery discipline | GitHub Actions workflows, build and deployment scripts, issue templates, release metadata, and security documentation |
| Responsible delivery | POPIA checklist, access-control guidance, security policy, and explicit separation of implemented and planned work |

## Current status

SAM LMS is under active development. The repository contains the application structure, integrations, documentation, automation, and deployment configuration. Some product areas remain in progress, so please treat the roadmap and the status markers below as the source of truth rather than assuming every listed integration is production-ready.

- **Implemented or configured:** React/Vite frontend, Node.js/TypeScript backend, PostgreSQL schema and migrations, authentication foundations, payment and messaging integration points, CI/CD workflows, security documentation, and development scripts.
- **In progress:** Course management, learner and educator dashboards, progress tracking, advanced analytics, and broader mobile support.
- **Planned:** Additional localisation, deeper offline capabilities, and expanded reporting.

## Architecture

```text
React + TypeScript frontend
          |
          v
Node.js + TypeScript API  ----  Better Auth
          |
          +---- PostgreSQL / Supabase migrations
          +---- Paystack payments
          +---- Africa's Talking SMS
          +---- Resend email
          +---- AWS storage and deployment configuration
```

The main directories are organised as follows:

```text
sam-lms/
├── backend/                 # Node.js/TypeScript API server
├── frontend/                # React/TypeScript application
├── infrastructure/          # AWS/Terraform configuration
├── curriculum/              # Curriculum and interaction assets
├── docs/                    # Development, deployment, and automation guides
├── infrastructure/database/ # Database schema and supporting configuration
├── supabase/                # Database migrations
└── .github/                 # CI workflows and issue templates
```

## Quick start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** >= 14.0
- **Git**

### Installation

```bash
git clone https://github.com/Sudz/sam-lms.git
cd sam-lms
npm run setup
npm run env:setup
npm run dev
```

Copy the example environment files before starting the services:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Use test or sandbox credentials locally. Never commit secrets. Production credentials should be supplied through a managed secret store or the deployment environment.

## Available commands

| Area | Commands |
|---|---|
| Development | `npm run setup`, `npm run dev`, `npm run dev:backend`, `npm run dev:frontend`, `npm run dev:db` |
| Testing | `npm test`, `npm run test:unit`, `npm run test:integration`, `npm run test:e2e`, `npm run test:coverage` |
| Quality | `npm run lint`, `npm run lint:fix`, `npm run type-check`, `npm run format` |
| Database | `npm run db:migrate`, `npm run db:seed`, `npm run db:reset`, `npm run db:studio` |
| Build and deployment | `npm run build`, `npm run build:backend`, `npm run build:frontend`, `npm run deploy`, `npm run deploy:staging` |
| Monitoring | `npm run monitor:start`, `npm run monitor:metrics`, `npm run monitor:health` |

## Technology and services

SAM LMS uses **TypeScript, React, Vite, Node.js, PostgreSQL, Supabase, Better Auth, Paystack, Africa’s Talking, Resend, AWS, Terraform, Jest, Testing Library, Supertest, Playwright, Lighthouse CI, ESLint, Prettier, GitHub Actions, Sentry, New Relic, Pingdom, and CloudWatch Logs**. The repository also contains optional Factory/Droid development automation documented in [docs/agents.md](docs/agents.md).

## Testing and delivery

The intended quality workflow covers unit tests, integration tests, end-to-end tests, performance checks, linting, formatting, type checking, security scanning, production builds, and deployment verification. Run only the commands that are currently available in your checkout, and update this section whenever the workflow changes.

The repository includes CI workflow definitions for continuous integration, testing, deployment, and security scanning. Production deployment is intended to require manual approval.

## South African context and privacy

The project includes documentation for South African integrations and a POPIA checklist. The privacy and security documents are design and implementation guidance for the project; they are not a substitute for a formal legal or compliance review before handling real learner data.

Localisation currently includes English as the default and planned or supported work for Swahili, Amharic, Yoruba, and Zulu. Translation files are located in `frontend/src/locales/`.

## Contributing

Contributions, issue reports, and thoughtful product feedback are welcome. Please read the repository’s [Code of Conduct](CODE_OF_CONDUCT.md), [Security Policy](SECURITY.md), and roadmap before opening an issue or pull request.

```bash
git checkout -b feature/your-change
npm test
npm run lint
git commit -m "Describe your change"
git push origin feature/your-change
```

Open a pull request with the problem, the approach taken, testing completed, and any remaining limitations.

## Related documentation

- [Roadmap](ROADMAP.md)
- [South African integrations](SA_INTEGRATIONS.md)
- [POPIA checklist](POPIA_CHECKLIST.md)
- [Security policy](SECURITY.md)
- [Code of conduct](CODE_OF_CONDUCT.md)
- [Agent automation guide](docs/agents.md)

## Licence and contact

SAM LMS is released under the [MIT Licence](LICENSE). For bugs and feature requests, use [GitHub Issues](https://github.com/Sudz/sam-lms/issues). For project and collaboration information, visit [saml.co.za](https://saml.co.za/).
