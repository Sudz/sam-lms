# SAM LMS - Smart African Learning Management System

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0%2B-blue.svg)
![React](https://img.shields.io/badge/react-18%2B-blue.svg)

> A modern, feature-rich Learning Management System designed for African educational institutions, built with TypeScript, React, and cutting-edge authentication.

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** >= 14.0
- **Git** for version control

### Factory/Droid CLI Integration

SAM LMS includes full Factory/droid CLI integration for automated development workflows:

```bash
# Install Factory CLI globally
npm install -g @factory/cli

# Initialize project with droid automation
factory init sam-lms
factory droid setup

# Start automated development workflow
factory droid start
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Sudz/sam-lms.git
cd sam-lms

# Install dependencies (automated via droid)
npm run setup

# Configure environment
npm run env:setup

# Start development servers
npm run dev
```

## 📋 Available Scripts

### Development
```bash
npm run setup          # Complete project setup with dependencies
npm run dev            # Start all development servers
npm run dev:backend    # Backend development server only
npm run dev:frontend   # Frontend development server only
npm run dev:db         # Database development tools
```

### Testing
```bash
npm test               # Run all tests
npm run test:unit      # Unit tests only
npm run test:e2e       # End-to-end tests
npm run test:coverage  # Test coverage report
npm run test:watch     # Watch mode for development
```

### Code Quality
```bash
npm run lint           # ESLint + Prettier
npm run lint:fix       # Auto-fix linting issues
npm run type-check     # TypeScript type checking
npm run format         # Format code with Prettier
```

### Database
```bash
npm run db:migrate     # Run database migrations
npm run db:seed        # Seed database with sample data
npm run db:reset       # Reset database (dev only)
npm run db:studio      # Open database management studio
```

### Deployment
```bash
npm run build          # Production build
npm run build:backend  # Backend production build
npm run build:frontend # Frontend production build
npm run deploy         # Deploy to production
npm run deploy:staging # Deploy to staging
```

### Agent Automation
```bash
npm run agent:setup    # Setup agent automation
npm run agent:test     # Run automated tests via agents
npm run agent:deploy   # Automated deployment workflow
npm run agent:monitor  # Start monitoring agents
```

## 🏗️ Project Structure

```
sam-lms/
├── backend/                 # Node.js/TypeScript API server
│   ├── src/
│   │   ├── controllers/     # API route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── migrations/         # Database migrations
│   └── tests/             # Backend tests
├── frontend/               # React/TypeScript frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── stores/        # State management
│   │   └── utils/         # Frontend utilities
│   └── tests/             # Frontend tests
├── infrastructure/         # AWS/Terraform configs
├── docs/                   # Documentation
│   ├── agents.md          # Agent automation guide
│   ├── deployment-guide.md # Deployment instructions
│   └── aws-setup.md       # AWS configuration
├── .github/               # GitHub workflows
└── supabase/              # Database schemas
```

## 🔧 Environment Configuration

### Environment Variables

Copy the example environment files and configure:

```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment  
cp frontend/.env.example frontend/.env
```

### Required Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sam_lms"

# Authentication
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3001"

# Payment Processing
PAYSTACK_SECRET_KEY="sk_test_your_paystack_secret"
PAYSTACK_PUBLIC_KEY="pk_test_your_paystack_public"

# SMS Services
AFRICAS_TALKING_USERNAME="your_username"
AFRICAS_TALKING_API_KEY="your_api_key"

# Email Services
RESEND_API_KEY="re_your_resend_api_key"

# AWS Configuration
AWS_ACCESS_KEY_ID="your_access_key"
AWS_SECRET_ACCESS_KEY="your_secret_key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="sam-lms-uploads"

# Factory/Droid Integration
FACTORY_API_KEY="your_factory_api_key"
DROID_AUTOMATION_TOKEN="your_droid_token"
```

### API Key Management

1. **Development Keys**: Use test/sandbox keys for local development
2. **Production Keys**: Store in secure environment variables
3. **Key Rotation**: Regularly rotate API keys (monthly recommended)
4. **Access Control**: Limit API key permissions to minimum required

### Secure Key Storage

```bash
# Using AWS Secrets Manager (production)
aws secretsmanager create-secret --name "sam-lms/production" --secret-string file://secrets.json

# Using environment-specific configs
npm run env:production  # Load production environment
npm run env:staging     # Load staging environment
npm run env:development # Load development environment
```

## 🤖 Agent Automation

SAM LMS includes comprehensive agent automation for development workflows. See [docs/agents.md](docs/agents.md) for detailed setup and configuration.

### Quick Agent Setup

```bash
# Install agent dependencies
npm run agent:install

# Configure agent environment
npm run agent:configure

# Start automation agents
npm run agent:start

# Monitor agent activity
npm run agent:dashboard
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows

- **`.github/workflows/ci.yml`** - Continuous Integration
- **`.github/workflows/deploy.yml`** - Deployment pipeline
- **`.github/workflows/test.yml`** - Automated testing
- **`.github/workflows/security.yml`** - Security scanning

### Pipeline Stages

1. **Code Quality**: ESLint, Prettier, TypeScript checks
2. **Testing**: Unit tests, integration tests, E2E tests
3. **Security**: Dependency scanning, SAST analysis
4. **Build**: Production builds for frontend and backend
5. **Deploy**: Automated deployment to staging/production

### Deployment Environments

- **Development**: Auto-deploy on feature branch push
- **Staging**: Auto-deploy on main branch merge
- **Production**: Manual approval required

## 🧪 Testing Strategy

### Test Types

- **Unit Tests**: Jest + Testing Library
- **Integration Tests**: Supertest for API testing
- **E2E Tests**: Playwright for browser automation
- **Performance Tests**: Lighthouse CI

### Running Tests

```bash
# Complete test suite
npm test

# Specific test categories
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:performance

# Test coverage
npm run test:coverage
```

## 📊 Monitoring & Analytics

### Application Monitoring

- **Error Tracking**: Sentry integration
- **Performance**: New Relic APM
- **Uptime**: Pingdom monitoring
- **Logs**: CloudWatch Logs

### Analytics Dashboard

```bash
# Start monitoring dashboard
npm run monitor:start

# View application metrics
npm run monitor:metrics

# Check system health
npm run monitor:health
```

## 🚀 Deployment

### Production Deployment

```bash
# Build for production
npm run build

# Deploy to AWS
npm run deploy:production

# Verify deployment
npm run deploy:verify
```

### Infrastructure as Code

Infrastructure is managed with Terraform:

```bash
# Initialize Terraform
cd infrastructure
terraform init

# Plan infrastructure changes
terraform plan

# Apply changes
terraform apply
```

## 🛡️ Security Features

- **Authentication**: BetterAuth with multiple providers
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: AES-256 encryption for sensitive data
- **API Security**: Rate limiting, input validation, CORS
- **Security Headers**: Helmet.js security headers
- **Vulnerability Scanning**: Automated dependency checks

## 🌍 Localization

SAM LMS supports multiple African languages:

- English (default)
- Swahili
- Amharic
- Yoruba
- Zulu

Translation files are located in `frontend/src/locales/`.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format

## 📋 Issue Templates

When reporting bugs or requesting features, please use our issue templates:

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
- [Factory CLI](https://factory.dev/) - Development automation platform

## 💬 Support

- **Issues**: Open a [GitHub issue](https://github.com/Sudz/sam-lms/issues) for bugs or feature requests
- **Documentation**: Check the [docs/](docs/) directory for detailed guides
- **Contact**: Visit [https://saml.co.za/](https://saml.co.za/) for more information
- **Community**: Join our [Discord server](https://discord.gg/sam-lms) for discussions

## 🌟 Project Status

SAM LMS is under active development. Key features:

- ✅ BetterAuth integration (email/password, magic links)
- ✅ Paystack payment processing
- ✅ Africa's Talking SMS notifications
- ✅ Resend email integration
- ✅ PostgreSQL database with migrations
- ✅ React frontend with Vite
- ✅ Factory/droid CLI integration
- ✅ Automated testing suite
- ✅ CI/CD pipeline
- 🚧 Course management system
- 🚧 User dashboard and progress tracking
- 🚧 Advanced analytics and reporting
- 🚧 Mobile application

---

**Built with passion for African learners — [https://saml.co.za/](https://saml.co.za/)**
