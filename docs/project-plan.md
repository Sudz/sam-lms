# Learning Management System (LMS) Project Plan

This document outlines the project plan for developing a Learning Management System (LMS) with a focus on African-centric services and leveraging Oracle Cloud Infrastructure (OCI) Free Tier resources. The plan is structured into nine phases, as provided by the user, with detailed tasks for each phase.

## Overall Goal
To develop a robust and scalable Learning Management System (LMS) that integrates with BetterAuth for authentication, Paystack for payments, Africa's Talking for SMS notifications, and Resend for email communications, all hosted on OCI Free Tier infrastructure.

## Project Phases and Detailed Tasks

### Phase 1: Project Initialization and Environment Setup
This phase focuses on setting up the foundational elements for the project, including repository creation, development environment configuration, and initial project structure.

| Task ID | Task Description | Key Deliverables | Notes |
|---|---|---|---|
| 1.1 | Create GitHub repository with the provided structure. | GitHub repository initialized | Ensure proper branching strategy (e.g., `main`, `develop`, feature branches). |
| 1.2 | Set up development environment on Windows 10 with VSCode. | VSCode configured, necessary extensions installed | |
| 1.3 | Install necessary software: Node.js, Docker, Git, OCI CLI, etc. | All required software installed and configured | Verify installations. |
| 1.4 | Clone the repository and set up the project structure. | Local repository cloned, project folders created | |
| 1.5 | Create root `package.json` and configure workspaces (if using monorepo) or separate for frontend and backend. | `package.json` files configured | Decide on monorepo vs. separate repos. |
| 1.6 | Set up environment configuration files (`.env` files for backend and frontend). | `.env` templates created | Include placeholders for API keys, database credentials, etc. |

### Phase 2: OCI Infrastructure Setup
This phase involves provisioning the necessary cloud resources on Oracle Cloud Infrastructure Free Tier to host the LMS application.

| Task ID | Task Description | Key Deliverables | Notes |
|---|---|---|---|
| 2.1 | Create OCI Free Tier account (if not already done). | OCI account active | |
| 2.2 | Create a compartment for the project. | OCI compartment created | For resource isolation and management. |
| 2.3 | Set up Virtual Cloud Network (VCN) with public subnet, internet gateway, and route tables. | VCN configured, network connectivity established | |
| 2.4 | Create security lists to allow necessary traffic (SSH, HTTP, HTTPS, custom ports for backend and frontend). | Security lists configured | Ensure inbound/outbound rules are correctly set. |
| 2.5 | Create two compute instances (VM.Standard.E2.1.Micro) for API and Redis (or use one for both if resources allow). | Compute instances provisioned | Consider resource allocation carefully for Free Tier. |
| 2.6 | Create Autonomous PostgreSQL database and note the connection string. | PostgreSQL database provisioned, connection string secured | |
| 2.7 | Create Object Storage bucket for static assets. | Object Storage bucket created | For storing images, videos, and other static content. |
| 2.8 | Set up API Gateway (if needed) and load balancer (if using multiple instances). | API Gateway/Load Balancer configured | Optional, depending on initial scale and complexity. |

### Phase 3: Database Setup and Schema Creation
This phase focuses on preparing the database for the LMS, including schema creation and connection testing.

| Task ID | Task Description | Key Deliverables | Notes |
|---|---|---|---|
| 3.1 | Connect to the Autonomous PostgreSQL database using a client (e.g., `psql`, DBeaver). | Database connection established | Verify access credentials. |
| 3.2 | Run the BetterAuth SQL script to create the necessary tables (if BetterAuth doesn't auto-generate). | BetterAuth tables created | Consult BetterAuth documentation for schema requirements. |
| 3.3 | Run the custom LMS SQL scripts to create the additional tables (user_profiles, courses, enrollments, etc.). | Custom LMS tables created | Design schema based on LMS requirements. |
| 3.4 | Set up connection pooling and test the database connection from the backend. | Connection pooling configured, successful connection tests | Optimize database connections for performance. |

### Phase 4: Backend Development (BetterAuth, API, Services)
This phase involves building the core backend logic, including authentication, API endpoints, and integration with external services.

| Task ID | Task Description | Key Deliverables | Notes |
|---|---|---|---|
| 4.1 | Initialize the backend project (if not already done) with Express and TypeScript. | Express/TypeScript project initialized | Set up project structure and dependencies. |
| 4.2 | Set up BetterAuth with the PostgreSQL adapter and configure it (email, social providers, etc.). | BetterAuth integrated and configured | Implement user registration, login, password reset. |
| 4.3 | Create the Express server and integrate BetterAuth as middleware. | Express server running with BetterAuth middleware | |
| 4.4 | Implement API routes for courses, enrollments, payments, and user progress. | RESTful API endpoints developed | Define clear API contracts. |
| 4.5 | Create middleware for authentication (using BetterAuth session validation) and error handling. | Authentication and error handling middleware implemented | Secure API endpoints. |
| 4.6 | Set up services for Paystack, Africa's Talking, and Resend. | Service clients/wrappers developed | Abstract external service interactions. |
| 4.7 | Implement webhook handlers for Paystack payment confirmations. | Paystack webhook endpoint implemented | Ensure secure webhook processing. |
| 4.8 | Set up Redis for session caching and rate limiting. | Redis integrated for caching and rate limiting | Improve performance and prevent abuse. |

### Phase 5: Frontend Development (Next.js, BetterAuth Client, UI)
This phase focuses on building the user interface and client-side logic for the LMS using Next.js.

| Task ID | Task Description | Key Deliverables | Notes |
|---|---|---|---|
| 5.1 | Initialize the Next.js project with TypeScript and Tailwind CSS. | Next.js project initialized | Set up styling and component library. |
| 5.2 | Set up BetterAuth client and configure it to point to the backend. | BetterAuth client integrated | Connect frontend to backend authentication. |
| 5.3 | Create authentication pages (sign-in, sign-up, verification) using BetterAuth components. | Authentication UI developed | User-friendly login/registration flow. |
| 5.4 | Implement dashboard layout and course listing pages. | Core UI pages developed | Display available courses and user dashboard. |
| 5.5 | Create course player and progress tracking components. | Interactive course player and progress UI | Allow users to consume course content and track progress. |
| 5.6 | Implement payment integration with Paystack (frontend part). | Paystack payment UI integrated | Initiate payment process from frontend. |
| 5.7 | Create admin pages for course management (if needed). | Admin UI developed | For content creators/administrators. |
| 5.8 | Set up state management with Zustand for global state (user, courses, etc.). | Zustand integrated for state management | Efficiently manage application state. |

### Phase 6: Integration (Paystack, Africa's Talking, Resend)
This phase ensures seamless communication and functionality between the LMS and its integrated third-party services.

| Task ID | Task Description | Key Deliverables | Notes |
|---|---|---|---|
| 6.1 | Integrate Paystack payment flow: frontend initialization and backend verification. | End-to-end payment flow working | Test various payment scenarios. |
| 6.2 | Integrate Africa's Talking for SMS notifications (course reminders, progress updates). | SMS notification system implemented | Configure templates for different notification types. |
| 6.3 | Integrate Resend for email notifications (welcome, course updates). | Email notification system implemented | Configure email templates. |
| 6.4 | Test the entire flow: user sign-up, course enrollment, payment, and notifications. | All integrations fully tested | Comprehensive end-to-end testing. |

### Phase 7: Testing and Security
This phase focuses on ensuring the quality, reliability, and security of the LMS application.

| Task ID | Task Description | Key Deliverables | Notes |
|---|---|---|---|
| 7.1 | Write unit and integration tests for backend API routes and services. | Backend test suite developed | Ensure API correctness and robustness. |
| 7.2 | Test frontend components and pages. | Frontend test suite developed | Verify UI functionality and responsiveness. |
| 7.3 | Perform end-to-end testing with Cypress or Playwright. | E2E test suite developed | Simulate user journeys. |
| 7.4 | Security audit: check for vulnerabilities, set up Helmet, CORS, etc. | Security measures implemented | Address common web vulnerabilities. |
| 7.5 | Load testing (if time permits). | Performance metrics gathered | Assess scalability under load. |

### Phase 8: Deployment and CI/CD
This phase covers the deployment of the LMS to OCI and setting up continuous integration and continuous deployment pipelines.

| Task ID | Task Description | Key Deliverables | Notes |
|---|---|---|---|
| 8.1 | Write Dockerfiles for backend and frontend. | Docker images created | Containerize the application components. |
| 8.2 | Set up Docker Compose for local development and production (if needed). | Docker Compose configuration | Simplify multi-container application management. |
| 8.3 | Set up GitHub Actions for CI/CD (test, build, and deploy to OCI). | CI/CD pipelines configured | Automate testing and deployment. |
| 8.4 | Configure the production environment variables in OCI compute instances. | Environment variables secured | Store sensitive information securely. |
| 8.5 | Deploy the backend and frontend to OCI compute instances (or use OCI Container Engine if using Kubernetes). | LMS deployed to OCI | Ensure application is accessible. |
| 8.6 | Set up custom domain and SSL certificates. | Custom domain and SSL configured | Secure communication with HTTPS. |

### Phase 9: Post-Launch Monitoring and Maintenance
This final phase focuses on ongoing operations, monitoring, and planning for future enhancements.

| Task ID | Task Description | Key Deliverables | Notes |
|---|---|---|---|
| 9.1 | Set up monitoring and logging (OCI Monitoring, Application Performance Monitoring). | Monitoring dashboards and alerts configured | Track application health and performance. |
| 9.2 | Set up alerts for errors and performance issues. | Alerting system in place | Proactive issue detection. |
| 9.3 | Plan for scaling and future enhancements. | Roadmap for future development | Continuous improvement and growth. |

## African-Focused Services Summary

| Service | Purpose | Key Features |
|---|---|---|
| **Paystack** | Payments | Multi-currency support (NGN, GHS, KES, ZAR), Card, Bank Transfer, Mobile Money, Webhook handling for payment confirmation. |
| **Africa's Talking** | SMS Notifications | Pan-African coverage, Course reminders & notifications, Verification codes. |
| **Resend** | Email Notifications | Transactional emails, Course notifications, BetterAuth integration. |

## OCI Free Tier Infrastructure Overview

| Component | Purpose | Notes |
|---|---|---|
| **Virtual Cloud Network (VCN)** | Network isolation and connectivity | Public subnet, Internet Gateway, Route Tables, Security Lists. |
| **Compute Instances (VM.Standard.E2.1.Micro)** | Hosting API and Redis | Two instances recommended for separation of concerns. |
| **Autonomous PostgreSQL Database** | Primary data storage | Managed database service for scalability and reliability. |
| **Object Storage Bucket** | Static asset storage | For course materials, images, and other media. |
| **API Gateway** | API management and security | Optional, for advanced routing and security. |
| **Load Balancer** | Traffic distribution | Optional, for high availability and scaling. |

This project plan provides a comprehensive roadmap for the development and deployment of the LMS. Each phase is designed to build upon the previous one, ensuring a structured and efficient development process. The integration of African-focused services and OCI Free Tier infrastructure will provide a cost-effective and regionally relevant solution.
