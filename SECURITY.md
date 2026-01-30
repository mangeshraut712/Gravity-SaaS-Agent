# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@gravity.ai**

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include

When reporting a vulnerability, please include:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies based on severity
  - Critical: Within 24-48 hours
  - High: Within 7 days
  - Medium: Within 30 days
  - Low: Next scheduled release

## Security Best Practices

### For Users

1. **Keep Updated**: Always use the latest version
2. **Environment Variables**: Never commit `.env` files
3. **API Keys**: Rotate API keys regularly
4. **HTTPS**: Always use HTTPS in production
5. **Database**: Enable Row Level Security (RLS) in Supabase

### For Contributors

1. **Dependencies**: Keep dependencies updated
2. **Secrets**: Never hardcode secrets
3. **Input Validation**: Always validate user input
4. **Authentication**: Use proper JWT validation
5. **Rate Limiting**: Implement rate limiting on all endpoints

## Known Security Features

### Authentication
- JWT-based authentication with secure tokens
- Session management with auto-refresh
- Row Level Security (RLS) in database

### API Security
- Rate limiting per user tier
- Input validation and sanitization
- CORS configuration
- Security headers (Helmet.js)

### Data Protection
- Environment variable encryption
- Secure password hashing
- SQL injection protection via Supabase
- XSS protection

## Security Updates

We will disclose security vulnerabilities in the following manner:

1. **Private Notification**: Notify affected users via email
2. **Public Disclosure**: After fix is available (typically 7-14 days)
3. **Release Notes**: Document in GitHub releases
4. **Security Advisory**: Create GitHub security advisory

## Bug Bounty Program

We currently do not have a bug bounty program. However, we deeply appreciate security researchers who responsibly disclose vulnerabilities to us.

## Hall of Fame

We recognize security researchers who have helped improve Gravity's security:

<!-- Contributors will be listed here after responsible disclosure -->

---

Thank you for helping keep Gravity and our users safe!
