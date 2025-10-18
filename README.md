# SAM LMS - Learning Management System

A culturally-grounded Learning Management System designed for African learners, built with modern web technologies and integrated with African payment and communication services.

## 🌍 Vision

SAM LMS provides an accessible, localized educational platform that respects African contexts, supports multiple payment methods (including mobile money via Paystack), and enables SMS notifications through Africa's Talking.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (AWS RDS or local instance)
- Environment variables configured (see `.env.example` files)

### Installation

```bash
# Clone the repository
git clone https://github.com/Sudz/sam-lms.git
cd sam-lms

# Install dependencies for both backend and frontend
npm install --workspaces
```

### Configuration

1. **Backend**: Copy `backend/.env.example` to `backend/.env` and configure:
   - `DATABASE_URL`: PostgreSQL connection string
   - `BETTER_AUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `PAYSTACK_SECRET_KEY`: From Paystack dashboard
   - `AFRICAS_TALKING_API_KEY` and `AFRICAS_TALKING_USERNAME`: From Africa's Talking
   - `RESEND_API_KEY`: From Resend dashboard

2. **Frontend**: Copy `frontend/.env.example` to `frontend/.env` and set:
   - `VITE_API_BASE_URL`: Backend API URL (default: `http://localhost:3001`)

### Running Locally

```bash
# Start backend (Express + BetterAuth)
cd backend
npm run dev  # Runs on http://localhost:3001

# In a separate terminal, start frontend (React + Vite)
cd frontend
npm run dev  # Runs on http://localhost:3000
```

The frontend proxies API requests to the backend during development.

### Database Setup

Run migrations to set up your PostgreSQL database:

```bash
cd backend
npm run migrate
```

Migration files are located in `backend/migrations/` and follow the naming convention: `YYYYMMDDHHMMSS_description.sql`.

## 📚 Documentation

- **[agents.md](docs/agents.md)**: Comprehensive guide for AI assistants working on this project, including architecture, workflows, and conventions
- **[project-plan.md](docs/project-plan.md)**: High-level project roadmap and milestones
- **[deployment-guide.md](docs/deployment-guide.md)**: Step-by-step deployment instructions for AWS
- **[aws-setup.md](docs/aws-setup.md)**: AWS infrastructure setup guide
- **[scope-and-sequence.md](curriculum/scope-and-sequence.md)**: Curriculum structure and learning pathways

## 🏗️ Architecture

### Tech Stack

**Frontend**:
- React 18 + TypeScript
- Vite (build tool & dev server)
- React Router for navigation
- Tailwind CSS for styling

**Backend**:
- Node.js + Express
- TypeScript
- BetterAuth for authentication (email/password, magic links)
- PostgreSQL (AWS RDS)

**Integrations**:
- **Paystack**: Payment processing (card, mobile money, bank transfer)
- **Africa's Talking**: SMS notifications
- **Resend**: Transactional emails
- **AWS**: RDS (PostgreSQL), EC2 (backend), S3/CloudFront (frontend)

### Project Structure

```
sam-lms/
├── backend/          # Express API + BetterAuth
│   ├── src/
│   │   ├── routes/   # API route handlers
│   │   ├── services/ # Business logic
│   │   └── server.ts # Entry point
│   ├── migrations/   # SQL migration files
│   └── package.json
├── frontend/         # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.tsx
│   └── package.json
├── curriculum/       # Course content and structure
├── docs/            # Project documentation
├── infrastructure/  # Deployment configs (future)
└── package.json     # Root workspace config
```

## 🔧 Development Workflow

### Branching Strategy

- `main`: Production-ready code
- Feature branches: `feature/description` or `fix/issue-description`
- Always create a branch for new work

### Commit Conventions

Use conventional commit messages:

```
feat: add course enrollment endpoint
fix: resolve Paystack webhook signature validation
docs: update deployment guide
chore: update dependencies
```

### Code Quality

**Frontend**:
```bash
cd frontend
npm run lint      # ESLint checks
npm run type-check # TypeScript validation
```

**Backend**:
```bash
cd backend
npm run build     # TypeScript compilation
npm run lint      # ESLint checks (if configured)
```

### Testing

Test commands are available (currently minimal):
```bash
npm test --workspaces
```

Expand test coverage as the project grows.

## 🚢 Deployment

### Build Process

```bash
# Build backend
cd backend
npm run build  # Outputs to backend/dist/

# Build frontend
cd frontend
npm run build  # Outputs to frontend/dist/
```

### Deployment Targets

- **Backend**: AWS EC2 instance or container service
- **Frontend**: AWS S3 + CloudFront, or Vercel/Netlify
- **Database**: AWS RDS PostgreSQL

### Environment Variables

Ensure all production environment variables are set in your hosting provider:
- Database connection strings
- API keys for Paystack, Africa's Talking, Resend
- BetterAuth configuration
- CORS origins

### Post-Deployment

1. Configure Paystack webhooks to point to `https://your-domain.com/api/payments/webhook`
2. Update BetterAuth callback URLs in your dashboard
3. Test authentication flows and payment processing

For detailed deployment instructions, see [deployment-guide.md](docs/deployment-guide.md).

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Read the documentation**: Start with [agents.md](docs/agents.md) to understand project conventions
2. **Create an issue**: Discuss your proposed changes before starting work
3. **Fork and branch**: Create a feature branch from `main`
4. **Follow conventions**: Use conventional commits, follow coding standards
5. **Test your changes**: Ensure linting passes and functionality works
6. **Submit a PR**: Use the pull request template and link related issues

### Development Guidelines

- Keep components small and focused
- Write meaningful commit messages
- Update documentation for significant changes
- Follow the existing code style
- Add tests for new features

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines (if available).

## 📋 Issue Templates

When reporting bugs or requesting features, please use the provided issue templates:
- **Bug Report**: `.github/ISSUE_TEMPLATE/bug.yml`
- **Feature Request**: `.github/ISSUE_TEMPLATE/feature_request.yml`

## 🔒 Security

For security vulnerabilities, please review our [Security Policy](SECURITY.md) and report issues responsibly.

## 📜 License

Licensed under the ISC License. See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [BetterAuth](https://github.com/better-auth/better-auth) - Modern authentication for TypeScript
- [Paystack](https://paystack.com/) - African payment infrastructure
- [Africa's Talking](https://africastalking.com/) - SMS and voice services
- [Resend](https://resend.com/) - Email for developers
- [Amazon Web Services](https://aws.amazon.com/) - Cloud infrastructure

## 💬 Support

- **Issues**: Open a [GitHub issue](https://github.com/Sudz/sam-lms/issues) for bugs or feature requests
- **Documentation**: Check the [docs/](docs/) directory for detailed guides
- **Contact**: Visit [https://saml.co.za/](https://saml.co.za/) for more information

## 🌟 Project Status

SAM LMS is under active development. Key features:

- ✅ BetterAuth integration (email/password, magic links)
- ✅ Paystack payment processing
- ✅ Africa's Talking SMS notifications
- ✅ Resend email integration
- ✅ PostgreSQL database with migrations
- ✅ React frontend with Vite
- 🚧 Course management system
- 🚧 User dashboard and progress tracking
- 🚧 Automated testing suite
- 🚧 CI/CD pipeline

---

**Built with passion for African learners — https://saml.co.za/**
