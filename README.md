# SAM LMS - Learning Management System

A modern, scalable Learning Management System (LMS) built with **Next.js**, **Express**, **BetterAuth**, and deployed on **Oracle Cloud Infrastructure (OCI) Free Tier**. The platform integrates African-focused services including **Paystack** for payments, **Africa's Talking** for SMS notifications, and **Resend** for email communications.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure authentication with BetterAuth (email, social providers)
- **Course Management**: Create, manage, and publish courses with modules and lessons
- **Enrollment System**: Track user enrollments and progress
- **Payment Integration**: Multi-currency support with Paystack (NGN, GHS, KES, ZAR)
- **Notifications**: Email (Resend) and SMS (Africa's Talking) notifications
- **Progress Tracking**: Monitor user progress through courses
- **Admin Dashboard**: Manage courses, users, and content
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

### Frontend
- **Next.js** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **BetterAuth Client** - Authentication client

### Backend
- **Express** - Node.js web framework
- **TypeScript** - Type-safe JavaScript
- **BetterAuth** - Authentication library
- **PostgreSQL** - Relational database
- **Redis** - Caching and session management

### Infrastructure
- **Oracle Cloud Infrastructure (OCI)** - Cloud hosting (Free Tier)
- **Autonomous PostgreSQL** - Managed database
- **Object Storage** - Static asset storage
- **Compute Instances** - VM hosting

### Third-Party Services
- **Paystack** - Payment processing
- **Africa's Talking** - SMS notifications
- **Resend** - Email notifications

## Project Structure

```
sam-lms/
├── frontend/              # Next.js frontend application
├── backend/               # Express backend API
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   ├── .env.example      # Environment variables template
│   ├── package.json
│   └── tsconfig.json
├── infrastructure/        # Infrastructure as Code
│   └── database/
│       └── schema.sql    # Database schema
├── docs/                  # Documentation
├── .github/workflows/     # CI/CD workflows
├── .gitignore
├── README.md
├── LICENSE
└── package.json
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v14 or higher)
- **Redis** (v6 or higher)
- **Git**
- **Docker** (optional, for containerization)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Sudz/sam-lms.git
cd sam-lms
```

2. **Install dependencies**

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Set up environment variables**

**Backend** (`backend/.env`):

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your configuration:

```env
PORT=3001
DATABASE_URL=postgresql://user:password@host:port/database
BETTERAUTH_SECRET=your_betterauth_secret
BETTERAUTH_EMAIL_FROM=no-reply@yourdomain.com
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_WEBHOOK_SECRET=your_paystack_webhook_secret
AFRICASTALKING_USERNAME=your_africastalking_username
AFRICASTALKING_API_KEY=your_africastalking_api_key
AFRICASTALKING_SENDER_ID=your_africastalking_sender_id
RESEND_API_KEY=your_resend_api_key
REDIS_URL=redis://localhost:6379
```

**Frontend** (`frontend/.env.local`):

```bash
cp frontend/.env.example frontend/.env.local
```

Edit `frontend/.env.local` with your configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_BETTERAUTH_URL=http://localhost:3001/auth
```

4. **Set up the database**

Run the database schema script:

```bash
psql -U your_username -d your_database -f infrastructure/database/schema.sql
```

## Development

### Running the Backend

```bash
cd backend
npm run dev
```

The backend API will be available at `http://localhost:3001`.

### Running the Frontend

```bash
cd frontend
npm run dev
```

The frontend application will be available at `http://localhost:3000`.

### Building for Production

**Backend**:

```bash
cd backend
npm run build
npm start
```

**Frontend**:

```bash
cd frontend
npm run build
npm start
```

## Deployment

### OCI Infrastructure Setup

1. Create an OCI Free Tier account
2. Set up a Virtual Cloud Network (VCN)
3. Create compute instances for the API and Redis
4. Provision an Autonomous PostgreSQL database
5. Create an Object Storage bucket for static assets

Refer to the [OCI Setup Guide](docs/oci-setup.md) for detailed instructions.

### CI/CD with GitHub Actions

The project includes GitHub Actions workflows for automated testing and deployment. Configure the following secrets in your GitHub repository:

- `OCI_CLI_USER`
- `OCI_CLI_TENANCY`
- `OCI_CLI_FINGERPRINT`
- `OCI_CLI_KEY_CONTENT`
- `OCI_CLI_REGION`

## API Documentation

API documentation is available at `/api/docs` when running the backend in development mode.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## Acknowledgments

- [BetterAuth](https://github.com/better-auth/better-auth) for authentication
- [Paystack](https://paystack.com/) for payment processing
- [Africa's Talking](https://africastalking.com/) for SMS services
- [Resend](https://resend.com/) for email services
- [Oracle Cloud Infrastructure](https://www.oracle.com/cloud/) for hosting

---

**Built with ❤️ for African learners**
