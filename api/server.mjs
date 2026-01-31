var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express2 from "express";
import cors from "cors";

// src/middleware/notFound.ts
var notFound = (req, res) => {
  res.status(404).json({
    mesage: "Route not found",
    path: req.originalUrl,
    date: Date()
  });
};
var notFound_default = notFound;

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// Enums

enum Role {
  STUDENT
  TUTOR
  ADMIN
}

enum UserStatus {
  ACTIVE
  BANNED
  INACTIVE
}

// User Model

model User {
  id            String     @id @default(uuid())
  name          String
  email         String     @unique
  image         String?
  emailVerified Boolean    @default(false)
  phone         String?
  isBanned      Boolean    @default(false)
  bannedReason  String?
  role          Role       @default(STUDENT)
  status        UserStatus @default(ACTIVE)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  sessions      Session[]
  accounts      Account[]

  // Relations
  tutorProfile    TutorProfile?
  studentBookings Booking[]     @relation("StudentBookings")
  reviews         Review[]

  @@map("user")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId])
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@map("account")
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verification")
}

model TutorProfile {
  id           String   @id @default(uuid())
  userId       String   @unique
  bio          String?  @db.Text
  title        String? // e.g., "Mathematics Expert", "Python Developer"
  experience   Int? // years of experience
  hourlyRate   Decimal  @db.Decimal(10, 2)
  rating       Decimal? @default(0) @db.Decimal(3, 2) // Average rating (0-5)
  totalReviews Int      @default(0)
  isVerified   Boolean  @default(false)
  languages    String[] // Array of languages spoken
  education    String?  @db.Text // Educational background
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  user         User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  categories   TutorCategory[]
  availability Availability[]
  bookings     Booking[]
  reviews      Review[]

  @@map("tutor_profiles")
}

enum BookingStatus {
  CONFIRMED
  COMPLETED
  CANCELLED
}

enum DayOfWeek {
  MONDAY
  TUESDAY
  WEDNESDAY
  THURSDAY
  FRIDAY
  SATURDAY
  SUNDAY
}

model Availability {
  id             String    @id @default(uuid())
  tutorProfileId String
  dayOfWeek      DayOfWeek
  startTime      String // Format: "HH:mm" (e.g., "09:00")
  endTime        String // Format: "HH:mm" (e.g., "17:00")
  isActive       Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  // Relations
  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id], onDelete: Cascade)

  @@map("availability")
}

model Booking {
  id                 String        @id @default(uuid())
  studentId          String
  tutorProfileId     String
  categoryId         String? // Optional: which subject/category is this booking for
  scheduledDate      DateTime // Date and time of the session
  duration           Int // Duration in minutes (e.g., 60, 90, 120)
  totalPrice         Decimal       @db.Decimal(10, 2)
  status             BookingStatus @default(CONFIRMED)
  notes              String?       @db.Text // Student's notes or requirements
  meetingLink        String? // Video call link (if applicable)
  cancellationReason String?       @db.Text
  cancelledAt        DateTime?
  completedAt        DateTime?
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  // Relations
  student      User         @relation("StudentBookings", fields: [studentId], references: [id], onDelete: Cascade)
  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id], onDelete: Cascade)
  review       Review?

  @@index([studentId])
  @@index([tutorProfileId])
  @@index([scheduledDate])
  @@index([status])
  @@map("bookings")
}

model Category {
  id          String   @id @default(uuid())
  name        String   @unique
  slug        String   @unique
  description String?  @db.Text
  icon        String? // Icon name or URL
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  tutors TutorCategory[]

  @@map("categories")
}

model Review {
  id             String   @id @default(uuid())
  bookingId      String   @unique
  studentId      String
  tutorProfileId String
  rating         Int // 1-5 stars
  comment        String?  @db.Text
  isVisible      Boolean  @default(true) // Admin can hide inappropriate reviews
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  // Relations
  booking      Booking      @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  student      User         @relation(fields: [studentId], references: [id], onDelete: Cascade)
  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id], onDelete: Cascade)

  @@index([tutorProfileId])
  @@index([rating])
  @@map("reviews")
}

// Junction table for many-to-many relationship between Tutors and Categories

model TutorCategory {
  id             String   @id @default(uuid())
  tutorProfileId String
  categoryId     String
  createdAt      DateTime @default(now())

  // Relations
  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id], onDelete: Cascade)
  category     Category     @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@unique([tutorProfileId, categoryId])
  @@map("tutor_categories")
}
`,
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"phone","kind":"scalar","type":"String"},{"name":"isBanned","kind":"scalar","type":"Boolean"},{"name":"bannedReason","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"studentBookings","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"hourlyRate","kind":"scalar","type":"Decimal"},{"name":"rating","kind":"scalar","type":"Decimal"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"languages","kind":"scalar","type":"String"},{"name":"education","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"categories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"}],"dbName":"tutor_profiles"},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"dayOfWeek","kind":"enum","type":"DayOfWeek"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"}],"dbName":"availability"},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"scheduledDate","kind":"scalar","type":"DateTime"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"totalPrice","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"notes","kind":"scalar","type":"String"},{"name":"meetingLink","kind":"scalar","type":"String"},{"name":"cancellationReason","kind":"scalar","type":"String"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"}],"dbName":"bookings"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"tutors","kind":"object","type":"TutorCategory","relationName":"CategoryToTutorCategory"}],"dbName":"categories"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"isVisible","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"}],"dbName":"reviews"},"TutorCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorCategory"}],"dbName":"tutor_categories"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AvailabilityScalarFieldEnum: () => AvailabilityScalarFieldEnum,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorCategoryScalarFieldEnum: () => TutorCategoryScalarFieldEnum,
  TutorProfileScalarFieldEnum: () => TutorProfileScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  TutorProfile: "TutorProfile",
  Availability: "Availability",
  Booking: "Booking",
  Category: "Category",
  Review: "Review",
  TutorCategory: "TutorCategory"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  image: "image",
  emailVerified: "emailVerified",
  phone: "phone",
  isBanned: "isBanned",
  bannedReason: "bannedReason",
  role: "role",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  bio: "bio",
  title: "title",
  experience: "experience",
  hourlyRate: "hourlyRate",
  rating: "rating",
  totalReviews: "totalReviews",
  isVerified: "isVerified",
  languages: "languages",
  education: "education",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AvailabilityScalarFieldEnum = {
  id: "id",
  tutorProfileId: "tutorProfileId",
  dayOfWeek: "dayOfWeek",
  startTime: "startTime",
  endTime: "endTime",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BookingScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorProfileId: "tutorProfileId",
  categoryId: "categoryId",
  scheduledDate: "scheduledDate",
  duration: "duration",
  totalPrice: "totalPrice",
  status: "status",
  notes: "notes",
  meetingLink: "meetingLink",
  cancellationReason: "cancellationReason",
  cancelledAt: "cancelledAt",
  completedAt: "completedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  description: "description",
  icon: "icon",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  studentId: "studentId",
  tutorProfileId: "tutorProfileId",
  rating: "rating",
  comment: "comment",
  isVisible: "isVisible",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TutorCategoryScalarFieldEnum = {
  id: "id",
  tutorProfileId: "tutorProfileId",
  categoryId: "categoryId",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "STUDENT"
      },
      phone: {
        type: "string",
        required: false
      },
      isBanned: {
        type: "boolean",
        required: false,
        defaultValue: false
      },
      bannedReason: {
        type: "string",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verificationURL = url;
      try {
        const info = await transporter.sendMail({
          from: '"Skill Bridge" <skill_bridge@gmail.com>',
          to: user.email,
          subject: "Email Verification",
          text: "Hello world?",
          // Plain-text version of the message
          html: `
                <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>

    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif;
      }

      .container {
        max-width: 520px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
      }

      .header {
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        padding: 26px;
        text-align: center;
        color: #ffffff;
      }

      .header h1 {
        margin: 0;
        font-size: 22px;
        font-weight: 600;
      }

      .content {
        padding: 30px 28px;
        color: #374151;
      }

      .content p {
        font-size: 15px;
        line-height: 1.6;
        margin: 0 0 16px;
      }

      .verify-btn {
        display: inline-block;
        margin: 26px 0;
        padding: 14px 24px;
        background: #4f46e5;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
      }

      .link-box {
        margin-top: 20px;
        padding: 14px;
        background: #f9fafb;
        border-radius: 8px;
        font-size: 13px;
        color: #6b7280;
        word-break: break-all;
      }

      .footer {
        background: #f9fafb;
        padding: 18px 24px;
        text-align: center;
        font-size: 13px;
        color: #6b7280;
      }

      .footer span {
        color: #4f46e5;
        font-weight: 600;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>Skill Bridge</h1>
      </div>

      <!-- Content -->
      <div class="content">
        <p>Hi \u{1F44B},${user.name}</p>

        <p>
          Welcome to <strong>Skill Bridge</strong>!  
          Please confirm your email address by clicking the button below.
        </p>

        <a href="${verificationURL}" class="verify-btn">
          Verify Email
        </a>

        <p>
          This verification link will expire in
          <strong>10 minutes</strong> for security reasons.
        </p>

        <p>
          If the button doesn\u2019t work, copy and paste this link into your browser:
        </p>

        <div class="link-box">
          ${verificationURL}
        </div>

        <p style="margin-top: 24px;">
          If you didn\u2019t create an account, you can safely ignore this email.
        </p>

        <p>
          \u2014 <br />
          The <strong>Skill Bridge</strong> Team
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        \xA9 2026 <span>Skill Bridge</span>. All rights reserved.
      </div>
    </div>
  </body>
</html>

                `
          // HTML version of the message
        });
        console.log("***** verification email send!");
      } catch (err) {
        console.log("verify email send fail");
        throw err;
      }
    },
    // Social Login Implementation
    socialProviders: {
      google: {
        prompt: "select_account consent",
        accessType: "offline",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      }
    }
  }
});

// src/module/tutors/tutor.route.ts
import express from "express";

// src/module/tutors/tutor.services.ts
var createTutorProfile = async (userId, payload) => {
  console.log(userId);
  const result = await prisma.tutorProfile.create({
    data: {
      ...payload,
      userId
    }
  });
  return result;
};
var getAllTutor = async () => {
  const [tutors, totalTeacher] = await Promise.all([
    prisma.tutorProfile.findMany(),
    prisma.tutorProfile.count()
  ]);
  return { tutors, totalTeacher };
};
var getTutorById = async (id) => {
  return await prisma.tutorProfile.findUnique({
    where: {
      id
    }
  });
};
var tutorServices = {
  createTutorProfile,
  getAllTutor,
  getTutorById
};

// src/module/tutors/tutor.controller.ts
var createTutorProfile2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: user information is missing"
      });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Request payload is required"
      });
    }
    const result = await tutorServices.createTutorProfile(
      user.id,
      req.body
    );
    return res.status(201).json({
      message: "Tutor profile created successfully",
      data: result
    });
  } catch (error) {
    if (error instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({
          message: "Tutor profile already exists for this user"
        });
      }
    }
    return res.status(500).json({
      message: "Failed to create tutor profile",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
var getAllTutor2 = async (req, res) => {
  try {
    const result = await tutorServices.getAllTutor();
    return res.status(200).json({
      message: "Tutor profiles retrieved successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve tutor profiles",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
var getTutorById2 = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "Tutor ID is required"
      });
    }
    const result = await tutorServices.getTutorById(id);
    if (!result) {
      return res.status(404).json({
        message: "Tutor profile not found"
      });
    }
    return res.status(200).json({
      message: "Tutor profile retrieved successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve tutor profile",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
var tutorController = {
  createTutorProfile: createTutorProfile2,
  getAllTutor: getAllTutor2,
  getTutorById: getTutorById2
};

// src/middleware/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized"
        });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required"
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have the permission"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth2;

// src/module/tutors/tutor.route.ts
var router = express.Router();
router.post("/", auth_default(), tutorController.createTutorProfile);
router.get("/", tutorController.getAllTutor);
router.get("/:id", tutorController.getTutorById);
var tutorRoutes = router;

// src/app.ts
var app = express2();
app.use(cors({
  origin: process.env.APP_URL || "http://localhost:3000",
  credentials: true
}));
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express2.json());
app.use("/api/tutor", tutorRoutes);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use(notFound_default);
var app_default = app;

// src/server.ts
var port = process.env.PORT || 5e3;
async function main() {
  try {
    await prisma.$connect();
    app_default.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error during server startup:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
