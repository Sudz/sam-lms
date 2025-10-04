# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our LMS (Learning Management System) seriously. If you believe you've found a security vulnerability, please follow these steps:

### 🚨 How to Report
**Private Disclosure**: Please DO NOT disclose security-related issues publicly until we've had a chance to address them.

**Email**: Send vulnerability reports to: info@saml.co.za

### 📋 What to Include
When reporting a vulnerability, please provide:
- Detailed description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Any proof-of-concept code (if available)
- Affected versions

### 🕒 Response Timeline
- **Initial Response**: Within 48 hours of report
- **Assessment**: Within 5 business days for initial assessment
- **Regular Updates**: Weekly updates on progress for accepted vulnerabilities
- **Public Disclosure**: Coordinated with reporter after patch release

### 🔒 Vulnerability Handling Process

#### If the vulnerability is accepted:
- We will acknowledge receipt within 48 hours
- Work on a fix will begin immediately
- You'll receive regular progress updates
- Credit will be given in the security advisory (unless you prefer anonymity)

#### If the vulnerability is declined:
- We will provide a detailed explanation
- Suggestions for alternative approaches if applicable
- Opportunity for discussion and clarification

### 🛡️ Security Measures in Place

Our LMS implements several security features:
- **Authentication**: BetterAuth with secure session management
- **Data Protection**: Encryption for sensitive data
- **API Security**: Input validation and rate limiting
- **Dependency Monitoring**: Regular security updates for dependencies
- **AWS Security**: Secure RDS PostgreSQL configuration

### 📦 Patch Release Policy
- **Critical vulnerabilities**: Patch within 72 hours
- **High severity**: Patch within 1-2 weeks
- **Medium severity**: Patch within 1 month
- **Low severity**: Addressed in next scheduled release

### 🙏 Thank You
We appreciate your efforts in responsibly disclosing vulnerabilities and helping us maintain the security and privacy of our users.

---
