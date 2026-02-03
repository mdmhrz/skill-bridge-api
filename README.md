# 🎓 SkillBridge API

<div align="center">

![SkillBridge Logo](https://img.shields.io/badge/SkillBridge-API-667eea?style=for-the-badge)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**A comprehensive RESTful backend server for connecting students with expert tutors**

[Live Demo](https://skill-bridge-backend-server.vercel.app/) • [Live Documentation](https://mdmhrz.github.io/skill-bridge-bruno-api-collection/) • [Database Schema](https://skill-bridge-backend-server.vercel.app/database.html) • [Report Bug](https://github.com/mdmhrz/skill-bridge-api/issues) • [Request Feature](https://github.com/mdmhrz/skill-bridge-api/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Scripts](#-scripts)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Overview

**SkillBridge API** is a robust, scalable backend service built to power modern tutor-student marketplaces. It provides comprehensive authentication, role-based access control, and complete CRUD operations for managing users, tutors, bookings, and reviews.

### Key Highlights

- 🔐 **Secure Authentication** - JWT-based auth with Better Auth integration
- 👥 **Role-Based Access** - Student, Tutor, and Admin roles with granular permissions
- 📧 **Email Verification** - Automated email verification with Nodemailer
- 🔍 **Advanced Search** - Filter tutors by category, experience, rating, and more
- 📊 **Pagination & Sorting** - Efficient data retrieval with customizable pagination
- ⚡ **High Performance** - Optimized queries with Prisma ORM and PostgreSQL
- 🚀 **Production Ready** - Deployed on Vercel with CI/CD

---

## ✨ Features

### Authentication & Authorization
- ✅ Email/Password registration with verification
- ✅ Google OAuth 2.0 integration
- ✅ JWT-based session management
- ✅ Role-based access control (RBAC)
- ✅ Email verification system

### User Management
- ✅ Student, Tutor, and Admin roles
- ✅ User profile management
- ✅ Ban/unban functionality (Admin only)
- ✅ Advanced user filtering and search

### Tutor Profiles
- ✅ Complete tutor profile creation and management
- ✅ Multi-category support
- ✅ Hourly rate configuration
- ✅ Experience and education tracking
- ✅ Language preferences
- ✅ Verification system

### Booking System
- ✅ Real-time session scheduling
- ✅ Status tracking (Confirmed, Completed, Cancelled)
- ✅ Meeting link integration
- ✅ Cancellation with reason tracking
- ✅ Duration and pricing management

### Reviews & Ratings
- ✅ 5-star rating system
- ✅ Written feedback support
- ✅ Automatic rating aggregation
- ✅ Visibility controls

### Availability Management
- ✅ Weekly schedule configuration
- ✅ Time slot management
- ✅ Overlap prevention
- ✅ Active/inactive toggles

### Categories
- ✅ Subject/skill categorization
- ✅ SEO-friendly slugs
- ✅ Icon support
- ✅ Active/inactive status

---

## 🛠️ Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | JavaScript runtime |
| **TypeScript** | 5.9.3 | Type-safe development |
| **Express.js** | 5.2.1 | Web framework |
| **Prisma** | 7.2.0 | ORM and database toolkit |
| **PostgreSQL** | Latest | Primary database |
| **Better Auth** | 1.4.9 | Authentication system |

### Key Libraries

- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **http-status** - HTTP status codes
- **cors** - Cross-origin resource sharing
- **tsx** - TypeScript execution
- **tsup** - TypeScript bundler

### Development Tools

- **pnpm** - Package manager
- **dotenv** - Environment configuration
- **Vercel** - Deployment platform

---

## 🗄️ Database Schema

SkillBridge uses a comprehensive PostgreSQL database with the following structure:

### Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    User     │───────│ TutorProfile │───────│  Category   │
│  (Student)  │  1:1  │              │  M:N  │             │
└─────────────┘       └──────────────┘       └─────────────┘
      │ 1:N                  │ 1:N
      │                      │
      ▼                      ▼
┌─────────────┐       ┌──────────────┐
│   Booking   │───────│ Availability │
│             │  1:N  │              │
└─────────────┘       └──────────────┘
      │ 1:1
      ▼
┌─────────────┐
│   Review    │
└─────────────┘
```

### Core Models

- **User** - Student, Tutor, and Admin accounts
- **TutorProfile** - Extended tutor information
- **Category** - Subject/skill classifications
- **TutorCategory** - Junction table for tutor-category relationships
- **Availability** - Tutor scheduling slots
- **Booking** - Session reservations
- **Review** - Student feedback and ratings

[View Complete Database Schema →](https://skill-bridge-backend-server.vercel.app/database.html)

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.x or higher)
- **pnpm** (v10.20.0 or higher)
- **PostgreSQL** (Latest version)
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/mdmhrz/skill-bridge-api.git
cd skill-bridge-api
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

### Environment Variables

Configure the following environment variables in your `.env` file:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/skillbridge?sslmode=require&channel_binding=require"
PORT=5000

# Better Auth Configuration
BETTER_AUTH_SECRET="your-secret-key-here-generate-a-strong-random-string"
BETTER_AUTH_URL="http://localhost:5000"
APP_URL="http://localhost:3000"

# Email Configuration (Gmail)
APP_USER="your-email@gmail.com"
APP_PASS="your-app-specific-password"

# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Admin Configuration
ADMIN_EMAIL="admin@skillbridge.com"
ADMIN_NAME="Admin User"
ADMIN_PASSWORD="secure-password-here"
```

#### 🔑 Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Configure consent screen
6. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/callback/google` (Development)
   - `https://your-domain.com/api/auth/callback/google` (Production)
7. Copy Client ID and Client Secret

#### 📧 Getting Gmail App Password

1. Enable 2-Factor Authentication on your Google Account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Select "Mail" and your device
4. Generate and copy the 16-character password

### Database Setup

1. **Generate Prisma Client**

```bash
pnpm prisma generate
```

2. **Run database migrations**

```bash
pnpm prisma migrate deploy
```

3. **Seed the database**

```bash
# Seed categories
pnpm seed:category

# Seed admin user
pnpm seed:admin
```

4. **Start development server**

```bash
pnpm dev
```

The server will start at `http://localhost:5000`

---

## 📚 API Documentation

### Base URL

```
Development: http://localhost:5000
Production: https://skill-bridge-backend-server.vercel.app
```

### Authentication

All protected routes require a valid JWT token in the request headers:

```http
Authorization: Bearer <your-jwt-token>
```

### API Endpoints

#### 🔐 Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/sign-up/email` | Register new user | ❌ |
| POST | `/api/auth/sign-in/email` | Login with email/password | ❌ |
| POST | `/api/auth/sign-in/google` | Login with Google OAuth | ❌ |
| POST | `/api/auth/sign-out` | Logout user | ✅ |
| GET | `/api/auth/verify-email` | Verify email address | ❌ |

#### 👤 Users

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/users` | Get all users | ✅ | Admin |
| GET | `/api/user/current-user/me` | Get current user | ✅ | All |

#### 👨‍🏫 Tutors

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/tutor` | Create tutor profile | ✅ | Student |
| GET | `/api/tutor` | Get all tutors | ❌ | - |
| GET | `/api/tutor/:id` | Get tutor by ID | ❌ | - |
| PUT | `/api/tutor` | Update tutor profile | ✅ | Tutor |
| DELETE | `/api/tutor` | Delete tutor profile | ✅ | Tutor |

#### 📚 Categories

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/categories` | Get all categories | ❌ | - |
| POST | `/api/categories` | Create category | ✅ | Admin |

#### 📖 Bookings

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/booking` | Create booking | ✅ | Student |
| GET | `/api/booking` | Get student bookings | ✅ | Student/Admin |
| GET | `/api/booking/:id` | Get booking by ID | ✅ | Student/Admin |

#### 📅 Availability

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/availability` | Create availability | ✅ | Tutor |
| PUT | `/api/availability/:id` | Update availability | ✅ | Tutor |

#### ⭐ Reviews

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/review` | Create review | ✅ | Student |
| PUT | `/api/review/:id` | Update review | ✅ | Student |
| DELETE | `/api/review/:id` | Delete review | ✅ | Student |

### Request Examples

#### Create Tutor Profile

```bash
POST /api/tutor
Content-Type: application/json
Authorization: Bearer <token>

{
  "bio": "Experienced mathematics tutor with 10+ years of teaching",
  "title": "Mathematics Expert",
  "experience": 10,
  "hourlyRate": 50.00,
  "languages": ["English", "Spanish"],
  "education": "PhD in Mathematics from MIT",
  "categories": [1, 8]
}
```

#### Get All Tutors with Filters

```bash
GET /api/tutor?page=1&limit=10&search=math&experience=5&sortBy=rating&sortOrder=desc
```

#### Create Booking

```bash
POST /api/booking
Content-Type: application/json
Authorization: Bearer <token>

{
  "tutorProfileId": "uuid-here",
  "categoryId": "1",
  "scheduledDate": "2026-02-15T10:00:00Z",
  "duration": 60,
  "totalPrice": 50.00,
  "notes": "Need help with calculus",
  "meetingLink": "https://meet.google.com/abc-defg-hij"
}
```

### Response Format

#### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

#### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

### Query Parameters

#### Pagination

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sortBy` - Field to sort by (default: createdAt)
- `sortOrder` - Sort order: asc/desc (default: desc)

#### Filters

- `search` - Search across multiple fields
- `role` - Filter by user role (STUDENT/TUTOR/ADMIN)
- `experience` - Filter by maximum years of experience
- `email` - Filter by email address

---

## 📁 Project Structure

```
skill-bridge-api/
├── api/                          # Vercel serverless functions
│   └── server.mjs               # Compiled server for production
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
├── public/                       # Static files
│   ├── index.html               # API landing page
│   └── database.html            # Database schema visualization
├── src/
│   ├── app.ts                   # Express app configuration
│   ├── server.ts                # Server entry point
│   ├── enums/
│   │   └── user.role.enum.ts   # User role enumerations
│   ├── lib/
│   │   ├── auth.ts             # Better Auth configuration
│   │   └── prisma.ts           # Prisma client initialization
│   ├── middleware/
│   │   ├── auth.ts             # Authentication middleware
│   │   └── notFound.ts         # 404 handler
│   ├── module/
│   │   ├── auth/               # Authentication routes
│   │   ├── availability/       # Availability management
│   │   ├── bookings/           # Booking system
│   │   ├── categories/         # Category management
│   │   ├── review/             # Review system
│   │   ├── tutors/             # Tutor profiles
│   │   └── users/              # User management
│   ├── scripts/
│   │   ├── seedAdmin.ts        # Admin user seeder
│   │   └── seedCategories.ts  # Categories seeder
│   ├── types/
│   │   └── index.d.ts          # TypeScript declarations
│   └── utils/
│       ├── error.ts            # Error handling utilities
│       └── paginationSortingHelper.ts
├── .env                         # Environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── vercel.json                 # Vercel deployment config
└── README.md                   # Project documentation
```

### Module Structure

Each module follows a consistent pattern:

```
module/
├── [module].controller.ts    # Request/Response handling
├── [module].service.ts       # Business logic
└── [module].route.ts         # Route definitions
```

---

## 📜 Scripts

Available npm scripts for development and deployment:

```bash
# Development
pnpm dev              # Start development server with hot reload

# Database
pnpm prisma generate  # Generate Prisma Client
pnpm prisma migrate   # Run database migrations
pnpm seed:admin       # Seed admin user
pnpm seed:category    # Seed categories

# Build
pnpm build            # Build for production
pnpm postinstall      # Auto-generate Prisma Client after install

# Testing
pnpm test             # Run tests (to be implemented)
```

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Deploy to Vercel**

```bash
vercel --prod
```

3. **Configure Environment Variables**

Go to Vercel Dashboard → Project → Settings → Environment Variables and add all required variables from `.env`

### Manual Deployment

1. **Build the project**

```bash
pnpm build
```

2. **Set environment variables on your hosting platform**

3. **Start the server**

```bash
node api/server.mjs
```

### Database Migration on Production

```bash
# On production server
npx prisma migrate deploy
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for API changes

### Reporting Bugs

If you find a bug, please create an issue with:
- Bug description
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)
- Environment details

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 👤 Contact

**MD Mahamudul Hasan Razu**

- GitHub: [@mdmhrz](https://github.com/mdmhrz)
- Email: razufreelance@gmail.com
- LinkedIn: [Connect with me](https://linkedin.com/in/mdmhrz)

**Project Link:** [https://github.com/mdmhrz/skill-bridge-api](https://github.com/mdmhrz/skill-bridge-api)

---

## 🙏 Acknowledgments

- [Better Auth](https://better-auth.com/) - Authentication system
- [Prisma](https://www.prisma.io/) - Database ORM
- [Express.js](https://expressjs.com/) - Web framework
- [Vercel](https://vercel.com/) - Deployment platform
- [PostgreSQL](https://www.postgresql.org/) - Database

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made by [Mobarak Hossain Razu](https://github.com/mdmhrz)

![Visitor Count](https://visitor-badge.laobi.icu/badge?page_id=mdmhrz.skill-bridge-api)

</div>
