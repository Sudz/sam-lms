# SAM LMS Agent & Developer Automation Guide

This document provides a complete, industry-standard guide to onboarding, automating, and operating agents and developer workflows for the SAM LMS project. It includes Factory/droid CLI integration, standardized scripts, environment configuration, CI/CD hooks, and best practices for API key management.

## Overview

- End-to-end automation for backend and frontend development
- Agent-powered workflows for testing, monitoring, and deployment
- Clear separation of environments (development, staging, production)
- Secure secret management and API key rotation guidance

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14
- Git
- Access to service provider dashboards (Paystack, Africa's Talking, Resend, AWS)

## Factory/Droid CLI Integration

Install and initialize Factory/droid for automated workflows:

```bash
npm install -g @factory/cli
factory init sam-lms
factory droid setup
factory droid start
```

Common droid tasks:

```bash
factory droid run lint
factory droid run test
factory droid run build
factory droid run deploy:staging
factory droid run agent:monitor
```

## Standardized NPM Scripts

From repository root:

```bash
# Setup and bootstrap
npm run setup          # Install and bootstrap all workspaces
npm run env:setup      # Copy .env.example files and prompt for secrets

# Development
npm run dev            # Start all services (backend + frontend + db watchers)
npm run dev:backend    # Start backend only
npm run dev:frontend   # Start frontend only

# Quality
npm run lint           # Lint all workspaces
npm run lint:fix       # Auto-fix issues
npm run type-check     # TypeScript checks

# Database
npm run db:migrate     # Run migrations
npm run db:seed        # Seed development data
npm run db:reset       # Reset local database

# Tests
npm test               # All tests
npm run test:unit      # Unit tests
npm run test:integration
npm run test:e2e       # Playwright E2E
npm run test:coverage

# Build/Deploy
npm run build          # Build all
npm run deploy         # Deploy production
npm run deploy:staging # Deploy staging

# Agents
npm run agent:setup    # Install agent deps, prepare configs
npm run agent:start    # Start agents
npm run agent:test     # Agent-driven testing flows
npm run agent:monitor  # Start monitoring agents
```

Note: Ensure corresponding scripts exist in package.json; see README.md for details.

## Environment Configuration

Copy and configure environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env  # if present
```

Backend (.env) essentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sam_lms"

# Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3001"

# Payments
PAYSTACK_SECRET_KEY="sk_test_..."
PAYSTACK_PUBLIC_KEY="pk_test_..."

# SMS
AFRICAS_TALKING_USERNAME="..."
AFRICAS_TALKING_API_KEY="..."

# Email
RESEND_API_KEY="re_..."

# AWS
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET="sam-lms-uploads"

# Factory/Droid
FACTORY_API_KEY="..."
DROID_AUTOMATION_TOKEN="..."
```

Environment best practices:

- Never commit .env files; use .gitignore
- Use separate credentials per environment
- Prefer cloud secrets (AWS Secrets Manager) in staging/production
- Rotate keys regularly (at least quarterly)

## Agent Workflow Integration

### Agent Roles

- Build Agent: builds code, caches dependencies
- Test Agent: runs unit/integration/E2E suites
- Deploy Agent: prepares artifacts and promotes to environments
- Monitor Agent: watches logs/metrics and alerts on anomalies

### Typical Agent Pipeline

1. Checkout → Install → Lint → Type-check
2. Unit tests → Integration tests → E2E tests
3. Build artifacts (frontend, backend)
4. Upload artifacts to S3 (staging) and invalidate CDN
5. Deploy to ECS/Lambda or server target
6. Smoke tests and health checks

### Running Locally with Agents

```bash
npm run agent:setup
npm run agent:start
npm run agent:test
npm run agent:monitor
```

## CI/CD Integration

GitHub Actions workflows should cover:

- ci.yml: install, lint, type-check, test, build
- deploy.yml: on main merge → deploy to staging, manual approval → production
- test.yml: nightly E2E and performance checks
- security.yml: dependency audit, SAST, secret scanning

Artifacts:

- Backend build (dist/) and Docker image
- Frontend build (build/) and static assets
- Test reports (junit, coverage)

## Onboarding Checklist

- [ ] Clone repo and run npm run setup
- [ ] Configure backend .env from .env.example
- [ ] Obtain API keys (Paystack, Africa's Talking, Resend, AWS)
- [ ] Configure Factory/Droid tokens
- [ ] Run npm run dev and verify local servers
- [ ] Run npm test to validate environment
- [ ] Run npm run db:migrate and npm run db:seed

## Troubleshooting

- Migrations fail: verify DATABASE_URL and Postgres is running
- Auth errors: confirm BETTER_AUTH_* vars and callback URLs
- Paystack verification failing: ensure test keys and webhook URL is reachable
- SMS not sending: check Africa's Talking credentials and sender ID whitelisting
- Emails not delivered: verify Resend domain and sender verification

## Security and Compliance

- Use least privilege IAM for AWS resources
- Enable 2FA on all provider accounts
- Store production secrets in AWS Secrets Manager or similar
- Log access and security events; review regularly

## References

- README.md for project overview and scripts
- docs/deployment-guide.md for environment-specific deployments
- docs/aws-setup.md for infrastructure and cloud services
