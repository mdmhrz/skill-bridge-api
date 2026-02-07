var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express8 from "express";
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
  "inlineSchema": `generator client {
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

model Category {
  id          Int      @id @default(autoincrement())
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

// Junction table for many-to-many relationship between Tutors and Categories

model TutorCategory {
  id             Int      @id @default(autoincrement())
  tutorProfileId String
  categoryId     Int
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
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"phone","kind":"scalar","type":"String"},{"name":"isBanned","kind":"scalar","type":"Boolean"},{"name":"bannedReason","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"studentBookings","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"hourlyRate","kind":"scalar","type":"Decimal"},{"name":"rating","kind":"scalar","type":"Decimal"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"languages","kind":"scalar","type":"String"},{"name":"education","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"categories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"}],"dbName":"tutor_profiles"},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"dayOfWeek","kind":"enum","type":"DayOfWeek"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"}],"dbName":"availability"},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"scheduledDate","kind":"scalar","type":"DateTime"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"totalPrice","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"notes","kind":"scalar","type":"String"},{"name":"meetingLink","kind":"scalar","type":"String"},{"name":"cancellationReason","kind":"scalar","type":"String"},{"name":"cancelledAt","kind":"scalar","type":"DateTime"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"}],"dbName":"bookings"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"isVisible","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"}],"dbName":"reviews"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"tutors","kind":"object","type":"TutorCategory","relationName":"CategoryToTutorCategory"}],"dbName":"categories"},"TutorCategory":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorCategory"}],"dbName":"tutor_categories"}},"enums":{},"types":{}}');
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
  Review: "Review",
  Category: "Category",
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
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // 5 minutes
    }
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false
    },
    disableCSRFCheck: true
    // Allow requests without Origin header (Postman, mobile apps, etc.)
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        input: false
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
    }
  },
  baseURL: process.env.BETTER_AUTH_URL,
  // Social Login Implementation
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/module/tutors/tutor.route.ts
import express from "express";

// src/utils/paginationSortingHelper.ts
var paginationSortingHelper = (options = {}, defaultSortBy = "createdAt") => {
  const page = Math.max(1, Number(options.page ?? 1));
  const limit = Math.max(1, Number(options.limit ?? 10));
  const skip = (page - 1) * limit;
  let sortOrder = "desc";
  if ((options.sortOrder || "").toLowerCase() === "asc") {
    sortOrder = "asc";
  }
  const sortBy = options.sortBy || defaultSortBy;
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationSortingHelper_default = paginationSortingHelper;

// src/module/tutors/tutor.services.ts
var createTutorProfile = async (userId, payload) => {
  const { categories, ...rest } = payload;
  if (!userId) throw new Error("User ID is required");
  if (!categories || categories.length === 0) throw new Error("At least one category must be selected");
  console.log(`*** Starting tutor profile creation for user: ${userId}`);
  try {
    const tutorProfile = await prisma.$transaction(async (tx) => {
      console.log("*** Checking if user exists...");
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found");
      console.log("*** Checking if user already has tutor profile...");
      const existingProfile = await tx.tutorProfile.findUnique({
        where: { userId }
      });
      if (existingProfile) throw new Error("User already has tutor profile");
      console.log("*** Creating tutor profile...");
      const profile = await tx.tutorProfile.create({
        data: {
          userId,
          ...rest,
          categories: {
            create: categories.map((categoryId) => ({
              category: { connect: { id: categoryId } }
            }))
          }
        }
      });
      if (!profile) throw new Error("Tutor profile not created");
      console.log("*** Updating user role to TUTOR...");
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { role: "TUTOR" /* TUTOR */ }
      });
      if (!updatedUser) throw new Error("User role not updated");
      console.log("*** Tutor profile created and role updated successfully");
      return profile;
    });
    return tutorProfile;
  } catch (error) {
    console.error("Failed to create tutor profile:", error.message || error);
    throw error;
  }
};
var getAllTutors = async (options = {}) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(options);
  const where = {};
  if (options.experience !== void 0) {
    where.experience = { gte: options.experience };
  }
  if (options.search) {
    where.OR = [
      {
        title: { contains: options.search, mode: "insensitive" }
      },
      {
        languages: { has: options.search }
      },
      {
        user: {
          OR: [
            { name: { contains: options.search, mode: "insensitive" } },
            { email: { contains: options.search, mode: "insensitive" } }
          ]
        }
      },
      {
        categories: {
          some: {
            category: { name: { contains: options.search, mode: "insensitive" } }
          }
        }
      }
    ];
  }
  const total = await prisma.tutorProfile.count({ where });
  const tutors = await prisma.tutorProfile.findMany({
    where,
    skip,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      categories: { include: { category: true } }
    }
  });
  return {
    data: tutors,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getTutorById = async (id) => {
  return await prisma.tutorProfile.findUnique({
    where: {
      id
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      categories: {
        select: {
          category: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      }
    }
  });
};
var updateTutorProfile = async (userId, payload) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  if (!payload || Object.keys(payload).length === 0) {
    throw new Error("No data provided for update");
  }
  try {
    const updatedProfile = await prisma.$transaction(async (tx) => {
      const existingProfile = await tx.tutorProfile.findUnique({
        where: { userId }
      });
      if (!existingProfile) {
        throw new Error("Tutor profile not found");
      }
      const {
        categories,
        name,
        image,
        phone,
        ...tutorProfileData
      } = payload;
      if (name || image || phone) {
        await tx.user.update({
          where: { id: userId },
          data: {
            ...name && { name },
            ...image && { image },
            ...phone && { phone }
          }
        });
      }
      const profile = await tx.tutorProfile.update({
        where: { userId },
        data: tutorProfileData
      });
      if (categories && categories.length > 0) {
        await tx.tutorCategory.deleteMany({
          where: { tutorProfileId: profile.id }
        });
        await tx.tutorCategory.createMany({
          data: categories.map((categoryId) => ({
            tutorProfileId: profile.id,
            categoryId
          }))
        });
      }
      return profile;
    });
    return updatedProfile;
  } catch (error) {
    throw error;
  }
};
var deleteTutorProfile = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingProfile = await tx.tutorProfile.findUnique({
        where: { userId }
      });
      if (!existingProfile) {
        throw new Error("Tutor profile not found");
      }
      await tx.tutorCategory.deleteMany({
        where: {
          tutorProfileId: existingProfile.id
        }
      });
      await tx.tutorProfile.delete({
        where: { userId }
      });
      await tx.user.update({
        where: { id: userId },
        data: {
          role: "STUDENT" /* STUDENT */
        }
      });
      return existingProfile;
    });
    return result;
  } catch (error) {
    throw error;
  }
};
var tutorServices = {
  createTutorProfile,
  getAllTutors,
  getTutorById,
  updateTutorProfile,
  deleteTutorProfile
};

// src/utils/error.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/module/tutors/tutor.controller.ts
import httpStatus from "http-status";
var createTutorProfile2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user information is missing"
      });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request payload is required"
      });
    }
    const { categories, hourlyRate, languages } = req.body;
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one category must be selected"
      });
    }
    if (!hourlyRate || typeof hourlyRate !== "number") {
      return res.status(400).json({
        success: false,
        message: "Hourly rate is required and must be a number"
      });
    }
    if (!languages || !Array.isArray(languages) || languages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one language must be selected"
      });
    }
    const tutorProfile = await tutorServices.createTutorProfile(
      user.id,
      req.body
    );
    return res.status(201).json({
      success: true,
      message: "Tutor profile created successfully",
      data: tutorProfile
    });
  } catch (error) {
    if (error instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({
          success: false,
          message: "Tutor profile already exists for this user"
        });
      }
    }
    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    if (error.message === "User already has tutor profile") {
      return res.status(409).json({
        success: false,
        message: "User already has a tutor profile"
      });
    }
    console.error(" Failed to create tutor profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create tutor profile",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
var getAllTutor = async (req, res) => {
  try {
    const paginationOptions = paginationSortingHelper_default({
      ...typeof req.query.page === "string" && { page: Number(req.query.page) },
      ...typeof req.query.limit === "string" && { limit: Number(req.query.limit) },
      ...typeof req.query.sortBy === "string" && { sortBy: req.query.sortBy },
      ...req.query.sortOrder === "asc" || req.query.sortOrder === "desc" ? { sortOrder: req.query.sortOrder } : {}
    });
    const filters = {};
    if (typeof req.query.search === "string" && req.query.search.trim()) {
      filters.search = req.query.search.trim();
    }
    if (req.query.experience && !isNaN(Number(req.query.experience))) {
      filters.experience = Number(req.query.experience);
    }
    const result = await tutorServices.getAllTutors({
      ...paginationOptions,
      ...filters
    });
    return res.status(httpStatus.OK).json({
      success: true,
      message: "Tutor profiles retrieved successfully",
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error("Get tutors error:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
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
var updateTutorProfile2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not authenticated"
      });
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided"
      });
    }
    const {
      experience,
      hourlyRate,
      languages,
      name,
      phone
    } = req.body;
    if (experience !== void 0 && experience < 0) {
      return res.status(400).json({
        success: false,
        message: "Experience must be a positive number"
      });
    }
    if (hourlyRate !== void 0 && hourlyRate <= 0) {
      return res.status(400).json({
        success: false,
        message: "Hourly rate must be greater than zero"
      });
    }
    if (languages !== void 0 && !Array.isArray(languages)) {
      return res.status(400).json({
        success: false,
        message: "Languages must be an array of strings"
      });
    }
    if (phone !== void 0 && typeof phone !== "string") {
      return res.status(400).json({
        success: false,
        message: "Phone must be a string"
      });
    }
    if (name !== void 0 && typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Name must be a string"
      });
    }
    const updatedProfile = await tutorServices.updateTutorProfile(
      user.id,
      req.body
    );
    return res.status(200).json({
      success: true,
      message: "Tutor profile updated successfully",
      data: updatedProfile
    });
  } catch (error) {
    if (error.message === "Tutor profile not found") {
      return res.status(404).json({
        success: false,
        message: "Tutor profile not found"
      });
    }
    if (error.message === "No data provided for update") {
      return res.status(400).json({
        success: false,
        message: "No update data provided"
      });
    }
    if (error instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
      return res.status(400).json({
        success: false,
        message: "Invalid update data"
      });
    }
    console.error("Failed to update tutor profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update tutor profile"
    });
  }
};
var deleteTutorProfile2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not authenticated"
      });
    }
    const deletedProfile = await tutorServices.deleteTutorProfile(
      user.id
    );
    return res.status(200).json({
      success: true,
      message: "Tutor profile deleted successfully",
      data: deletedProfile
    });
  } catch (error) {
    if (error.message === "Tutor profile not found") {
      return res.status(404).json({
        success: false,
        message: "Tutor profile not found"
      });
    }
    if (error instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
      return res.status(400).json({
        success: false,
        message: "Failed to delete tutor profile"
      });
    }
    console.error("Failed to delete tutor profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete tutor profile"
    });
  }
};
var tutorController = {
  createTutorProfile: createTutorProfile2,
  getAllTutor,
  getTutorById: getTutorById2,
  updateTutorProfile: updateTutorProfile2,
  deleteTutorProfile: deleteTutorProfile2
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
router.post("/", auth_default("STUDENT" /* STUDENT */), tutorController.createTutorProfile);
router.get("/", tutorController.getAllTutor);
router.get("/:id", tutorController.getTutorById);
router.put("/", auth_default("TUTOR" /* TUTOR */), tutorController.updateTutorProfile);
router.delete("/", auth_default("TUTOR" /* TUTOR */), tutorController.deleteTutorProfile);
var tutorRoutes = router;

// src/module/categories/category.routes.ts
import express2 from "express";

// src/module/categories/category.services.ts
var getAllCategories = async () => {
  return await prisma.category.findMany();
};
var createCategory = async (payload) => {
  try {
    return await prisma.category.create({
      data: {
        name: payload.name,
        slug: payload.slug,
        description: payload.description ?? null,
        icon: payload.icon ?? null
      }
    });
  } catch (error) {
    throw error;
  }
};
var categoryServices = {
  getAllCategories,
  createCategory
};

// src/module/categories/category.controller.ts
var getAllCategories2 = async (req, res) => {
  try {
    const result = await categoryServices.getAllCategories();
    if (!result) {
      return res.status(404).json({
        message: "Categories not found"
      });
    }
    return res.status(200).json({
      message: "Categories retrieved successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve categories",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
var createCategory2 = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request payload is required"
      });
    }
    const { name, slug, description } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Category name is required and must be a string"
      });
    }
    if (!slug || typeof slug !== "string") {
      return res.status(400).json({
        success: false,
        message: "Category slug is required and must be a string"
      });
    }
    const normalizedSlug = slug.toLowerCase().trim().replace(/\s+/g, "-");
    if (!/^[a-z0-9-]+$/.test(normalizedSlug)) {
      return res.status(400).json({
        success: false,
        message: "Slug can only contain lowercase letters, numbers, and hyphens"
      });
    }
    const category = await categoryServices.createCategory({
      name: name.trim(),
      slug: normalizedSlug,
      description: description?.trim() || null
    });
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });
  } catch (error) {
    if (error instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({
          success: false,
          message: "Category with this name or slug already exists"
        });
      }
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
var categoryController = {
  getAllCategories: getAllCategories2,
  createCategory: createCategory2
};

// src/module/categories/category.routes.ts
var router2 = express2.Router();
router2.get("/", categoryController.getAllCategories);
router2.post("/", auth_default("ADMIN" /* ADMIN */), categoryController.createCategory);
var categoryRoutes = router2;

// src/module/auth/currentUserRoutes.ts
import { Router as Router3 } from "express";
var router3 = Router3();
router3.get("/me", auth_default(), async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.status(200).json({
    message: "User data retrieved successfully",
    data: user
  });
});
var currentUserRoutes = router3;

// src/module/bookings/booking.route.ts
import express4 from "express";

// src/module/bookings/booking.services.ts
var createBooking = async (studentId, payload) => {
  if (!studentId) {
    throw new AppError(401, "Unauthorized user");
  }
  if (!payload) {
    throw new AppError(400, "No data provided");
  }
  const {
    tutorProfileId,
    categoryId,
    scheduledDate,
    duration,
    totalPrice,
    notes,
    meetingLink
  } = payload;
  if (!tutorProfileId) {
    throw new AppError(400, "Tutor profile ID is required");
  }
  if (!categoryId) {
    throw new AppError(400, "Category ID is required");
  }
  if (!scheduledDate) {
    throw new AppError(400, "Scheduled date is required");
  }
  if (!duration || duration <= 0) {
    throw new AppError(400, "Duration must be greater than zero");
  }
  if (!totalPrice || Number(totalPrice) <= 0) {
    throw new AppError(400, "Total price must be greater than zero");
  }
  const bookingDate = new Date(scheduledDate);
  if (isNaN(bookingDate.getTime())) {
    throw new AppError(400, "Invalid scheduled date format");
  }
  if (bookingDate < /* @__PURE__ */ new Date()) {
    throw new AppError(400, "You cannot book a session in the past");
  }
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: tutorProfileId }
  });
  if (!tutorProfile) {
    throw new AppError(404, "Tutor profile not found");
  }
  const category = await prisma.category.findUnique({
    where: { id: Number(categoryId) }
  });
  if (!category) {
    throw new AppError(404, "Category not found");
  }
  const tutorCategory = await prisma.tutorCategory.findFirst({
    where: {
      tutorProfileId,
      categoryId: Number(categoryId)
    }
  });
  if (!tutorCategory) {
    throw new AppError(
      400,
      "This tutor does not provide sessions for this category"
    );
  }
  const existingBooking = await prisma.booking.findFirst({
    where: {
      tutorProfileId,
      scheduledDate: bookingDate
    }
  });
  if (existingBooking?.studentId === studentId) {
    throw new AppError(
      409,
      "You already have a booking at the selected time"
    );
  }
  if (existingBooking) {
    throw new AppError(
      409,
      "This tutor already has a booking at the selected time"
    );
  }
  const booking = await prisma.booking.create({
    data: {
      studentId,
      tutorProfileId,
      categoryId,
      scheduledDate: bookingDate,
      duration,
      totalPrice,
      notes: notes || null,
      meetingLink: meetingLink || null
    }
  });
  return {
    message: "Booking created successfully",
    booking
  };
};
var getStudentBookings = async (studentId) => {
  if (!studentId) {
    throw new AppError(401, "Unauthorized user");
  }
  const studentBookings = await prisma.booking.findMany({
    where: { studentId },
    orderBy: {
      scheduledDate: "desc"
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          image: true,
          phone: true
        }
      },
      tutorProfile: {
        select: {
          id: true,
          user: {
            select: {
              name: true,
              email: true,
              image: true,
              phone: true
            }
          }
        }
      }
    }
  });
  if (!studentBookings || studentBookings.length === 0) {
    throw new AppError(404, "No bookings found for this student");
  }
  return {
    message: "Bookings retrieved successfully",
    studentBookings
  };
};
var getBookingById = async (studentId, bookingId) => {
  if (!studentId) {
    throw new AppError(401, "Unauthorized user");
  }
  if (!bookingId) {
    throw new AppError(401, "No booking ID provided");
  }
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId, studentId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          image: true,
          phone: true
        }
      },
      tutorProfile: {
        select: {
          id: true,
          user: {
            select: {
              name: true,
              email: true,
              image: true,
              phone: true
            }
          }
        }
      }
    }
  });
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }
  return {
    message: "Booking retrieved successfully",
    booking
  };
};
var bookingServices = {
  createBooking,
  getStudentBookings,
  getBookingById
};

// src/module/bookings/booking.controller.ts
var createBooking2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access"
      });
    }
    const result = await bookingServices.createBooking(user.id, req.body);
    return res.status(201).json({
      success: true,
      message: result.message,
      data: result.booking
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error("Create booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
var getStudentBookings2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access"
      });
    }
    const result = await bookingServices.getStudentBookings(user.id);
    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.studentBookings
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error("Get student bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
var getBookingById2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access"
      });
    }
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required"
      });
    }
    const result = await bookingServices.getBookingById(user.id, req.params.id);
    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.booking
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error("Get student bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
var bookingController = {
  createBooking: createBooking2,
  getStudentBookings: getStudentBookings2,
  getBookingById: getBookingById2
};

// src/module/bookings/booking.route.ts
var router4 = express4.Router();
router4.post("/", auth_default("STUDENT" /* STUDENT */), bookingController.createBooking);
router4.get("/", auth_default("STUDENT" /* STUDENT */, "ADMIN" /* ADMIN */), bookingController.getStudentBookings);
router4.get("/:id", auth_default("STUDENT" /* STUDENT */, "ADMIN" /* ADMIN */), bookingController.getBookingById);
var bookingRoutes = router4;

// src/module/availability/availability.route.ts
import express5 from "express";

// src/module/availability/availability.services.ts
import httpStatus2 from "http-status";
var createAvailability = async (availability) => {
  const {
    tutorProfileId,
    dayOfWeek,
    startTime,
    endTime
  } = availability;
  if (!tutorProfileId || !dayOfWeek || !startTime || !endTime) {
    throw new AppError(
      httpStatus2.BAD_REQUEST,
      "Tutor profile, day, start time and end time are required"
    );
  }
  if (startTime >= endTime) {
    throw new AppError(
      httpStatus2.BAD_REQUEST,
      "Start time must be earlier than end time"
    );
  }
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: tutorProfileId }
  });
  if (!tutorProfile) {
    throw new AppError(
      httpStatus2.NOT_FOUND,
      "Tutor profile not found"
    );
  }
  const existingAvailability = await prisma.availability.findFirst({
    where: {
      tutorProfileId,
      dayOfWeek,
      OR: [
        {
          startTime: { lte: startTime },
          endTime: { gt: startTime }
        },
        {
          startTime: { lt: endTime },
          endTime: { gte: endTime }
        }
      ]
    }
  });
  if (existingAvailability) {
    throw new AppError(
      httpStatus2.CONFLICT,
      "Availability already exists for this time slot"
    );
  }
  const result = await prisma.availability.create({
    data: availability
  });
  return {
    message: "Availability created successfully",
    result
  };
};
var updateAvailability = async (availabilityId, userId, payload) => {
  if (!availabilityId) {
    throw new AppError(
      httpStatus2.BAD_REQUEST,
      "Availability ID is required"
    );
  }
  const availability = await prisma.availability.findUnique({
    where: { id: availabilityId },
    include: {
      tutorProfile: true
    }
  });
  if (!availability) {
    throw new AppError(
      httpStatus2.NOT_FOUND,
      "Availability not found"
    );
  }
  if (availability.tutorProfile.userId !== userId) {
    throw new AppError(
      httpStatus2.FORBIDDEN,
      "You are not allowed to update this availability"
    );
  }
  const {
    dayOfWeek,
    startTime,
    endTime,
    isActive
  } = payload;
  const finalStartTime = startTime ?? availability.startTime;
  const finalEndTime = endTime ?? availability.endTime;
  if (finalStartTime >= finalEndTime) {
    throw new AppError(
      httpStatus2.BAD_REQUEST,
      "Start time must be earlier than end time"
    );
  }
  const overlap = await prisma.availability.findFirst({
    where: {
      id: { not: availabilityId },
      tutorProfileId: availability.tutorProfileId,
      dayOfWeek: dayOfWeek ?? availability.dayOfWeek,
      OR: [
        {
          startTime: { lte: finalStartTime },
          endTime: { gt: finalStartTime }
        },
        {
          startTime: { lt: finalEndTime },
          endTime: { gte: finalEndTime }
        }
      ]
    }
  });
  if (overlap) {
    throw new AppError(
      httpStatus2.CONFLICT,
      "Availability overlaps with an existing time slot"
    );
  }
  const updateData = {};
  if (dayOfWeek !== void 0) updateData.dayOfWeek = dayOfWeek;
  if (startTime !== void 0) updateData.startTime = startTime;
  if (endTime !== void 0) updateData.endTime = endTime;
  if (isActive !== void 0) updateData.isActive = isActive;
  const result = await prisma.availability.update({
    where: { id: availabilityId },
    data: updateData
  });
  return {
    message: "Availability updated successfully",
    result
  };
};
var availabilityServices = {
  createAvailability,
  updateAvailability
};

// src/module/availability/availability.controller.ts
import httpStatus3 from "http-status";
var createAvailability2 = async (req, res) => {
  try {
    if (!req.body) {
      throw new AppError(httpStatus3.BAD_REQUEST, "Availability data is required");
    }
    const result = await availabilityServices.createAvailability(req.body);
    res.status(httpStatus3.CREATED).json({
      success: true,
      message: result.message,
      data: result.result
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error("Create availability error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create availability",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
var updateAvailability2 = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user?.id) {
      throw new AppError(
        httpStatus3.UNAUTHORIZED,
        "Unauthorized access"
      );
    }
    if (!id) {
      throw new AppError(
        httpStatus3.BAD_REQUEST,
        "Availability ID is required"
      );
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new AppError(
        httpStatus3.BAD_REQUEST,
        "Update data is required"
      );
    }
    const result = await availabilityServices.updateAvailability(
      id,
      user.id,
      req.body
    );
    res.status(httpStatus3.OK).json({
      success: true,
      message: result.message,
      data: result.result
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error("Update availability error:", error);
    return res.status(httpStatus3.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update availability"
    });
  }
};
var availabilityController = {
  createAvailability: createAvailability2,
  updateAvailability: updateAvailability2
};

// src/module/availability/availability.route.ts
var router5 = express5.Router();
router5.post("/", auth_default("TUTOR" /* TUTOR */), availabilityController.createAvailability);
router5.put("/:id", auth_default("TUTOR" /* TUTOR */), availabilityController.updateAvailability);
var availabilityRoutes = router5;

// src/module/review/review.route.ts
import express6 from "express";

// src/module/review/review.services.ts
import httpStatus4 from "http-status";
var createReview = async (payload) => {
  const { bookingId, studentId, tutorProfileId, rating, comment } = payload;
  if (!bookingId || !studentId || !tutorProfileId || !rating) {
    throw new AppError(
      httpStatus4.BAD_REQUEST,
      "bookingId, studentId, tutorProfileId, and rating are required"
    );
  }
  if (rating < 1 || rating > 5) {
    throw new AppError(
      httpStatus4.BAD_REQUEST,
      "Rating must be between 1 and 5"
    );
  }
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });
  if (!booking) {
    throw new AppError(
      httpStatus4.NOT_FOUND,
      "Booking not found"
    );
  }
  if (booking.studentId !== studentId) {
    throw new AppError(
      httpStatus4.FORBIDDEN,
      "You can only review bookings you made"
    );
  }
  const existingReview = await prisma.review.findUnique({
    where: { bookingId }
  });
  if (existingReview) {
    throw new AppError(
      httpStatus4.CONFLICT,
      "A review for this booking already exists"
    );
  }
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorProfileId }
  });
  if (!tutor) {
    throw new AppError(
      httpStatus4.NOT_FOUND,
      "Tutor profile not found"
    );
  }
  const review = await prisma.review.create({
    data: {
      bookingId,
      studentId,
      tutorProfileId,
      rating,
      comment: comment || null
    }
  });
  return {
    message: "Review created successfully",
    result: review
  };
};
var updateReview = async (reviewId, userId, payload) => {
  if (!reviewId) {
    throw new AppError(httpStatus4.BAD_REQUEST, "Review ID is required");
  }
  if (!payload || Object.keys(payload).length === 0) {
    throw new AppError(httpStatus4.BAD_REQUEST, "Update data is required");
  }
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });
  if (!review) {
    throw new AppError(httpStatus4.NOT_FOUND, "Review not found");
  }
  if (review.studentId !== userId) {
    throw new AppError(
      httpStatus4.FORBIDDEN,
      "You are not allowed to update this review"
    );
  }
  const { rating, comment } = payload;
  if (rating !== void 0 && (rating < 1 || rating > 5)) {
    throw new AppError(
      httpStatus4.BAD_REQUEST,
      "Rating must be between 1 and 5"
    );
  }
  const updateData = {};
  if (rating !== void 0) updateData.rating = rating;
  if (comment !== void 0) updateData.comment = comment;
  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: updateData
  });
  return {
    message: "Review updated successfully",
    result: updatedReview
  };
};
var deleteReview = async (reviewId, userId) => {
  if (!reviewId) {
    throw new AppError(httpStatus4.BAD_REQUEST, "Review ID is required");
  }
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });
  if (!review) {
    throw new AppError(httpStatus4.NOT_FOUND, "Review not found");
  }
  if (review.studentId !== userId) {
    throw new AppError(
      httpStatus4.FORBIDDEN,
      "You are not allowed to delete this review"
    );
  }
  await prisma.review.delete({
    where: { id: reviewId }
  });
  return {
    message: "Review deleted successfully",
    result: null
  };
};
var reviewServices = {
  createReview,
  updateReview,
  deleteReview
};

// src/module/review/review.controller.ts
import httpStatus5 from "http-status";
var createReview2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user?.id) {
      throw new AppError(
        httpStatus5.UNAUTHORIZED,
        "Unauthorized access"
      );
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new AppError(
        httpStatus5.BAD_REQUEST,
        "Review data is required"
      );
    }
    const payload = {
      ...req.body,
      studentId: user.id
    };
    const result = await reviewServices.createReview(payload);
    res.status(httpStatus5.CREATED).json({
      success: true,
      message: result.message,
      data: result.result
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error("Create review error:", error);
    return res.status(httpStatus5.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create review",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
var updateReview2 = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    if (!user?.id) {
      throw new AppError(httpStatus5.UNAUTHORIZED, "Unauthorized access");
    }
    if (!id) {
      throw new AppError(httpStatus5.BAD_REQUEST, "Review ID is required");
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new AppError(httpStatus5.BAD_REQUEST, "Update data is required");
    }
    const result = await reviewServices.updateReview(
      id,
      user.id,
      req.body
    );
    res.status(httpStatus5.OK).json({
      success: true,
      message: result.message,
      data: result.result
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error("Update review error:", error);
    return res.status(httpStatus5.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update review",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
var deleteReview2 = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    if (!user?.id) {
      throw new AppError(httpStatus5.UNAUTHORIZED, "Unauthorized access");
    }
    if (!id) {
      throw new AppError(httpStatus5.BAD_REQUEST, "Review ID is required");
    }
    const result = await reviewServices.deleteReview(id, user.id);
    res.status(httpStatus5.OK).json({
      success: true,
      message: result.message,
      data: result.result
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error("Delete review error:", error);
    return res.status(httpStatus5.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to delete review",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
var reviewController = {
  createReview: createReview2,
  updateReview: updateReview2,
  deleteReview: deleteReview2
};

// src/module/review/review.route.ts
var router6 = express6.Router();
router6.post("/", auth_default("STUDENT" /* STUDENT */), reviewController.createReview);
router6.put("/:id", auth_default("STUDENT" /* STUDENT */), reviewController.updateReview);
router6.delete("/:id", auth_default("STUDENT" /* STUDENT */), reviewController.deleteReview);
var reviewRoutes = router6;

// src/module/users/user.route.ts
import express7 from "express";

// src/module/users/user.services.ts
var getUsers = async (options = {}) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(options);
  const where = {};
  if (options.role) {
    where.role = options.role;
  }
  if (options.email) {
    where.email = {
      contains: options.email,
      mode: "insensitive"
    };
  }
  if (options.search) {
    where.OR = [
      { name: { contains: options.search, mode: "insensitive" } },
      { email: { contains: options.search, mode: "insensitive" } }
    ];
  }
  const totalUsers = await prisma.user.count({ where });
  const users = await prisma.user.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return {
    message: "Users retrieved successfully",
    data: users,
    pagination: {
      total: totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit)
    }
  };
};
var userServices = {
  getUsers
};

// src/module/users/user.controller.ts
import httpStatus6 from "http-status";
var getUsers2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user?.id) {
      throw new AppError(httpStatus6.UNAUTHORIZED, "Unauthorized access");
    }
    if (user.role !== "ADMIN") {
      throw new AppError(httpStatus6.FORBIDDEN, "Access denied: Admins only");
    }
    const paginationOptions = paginationSortingHelper_default({
      ...typeof req.query.page === "string" ? { page: Number(req.query.page) } : {},
      ...typeof req.query.limit === "string" ? { limit: Number(req.query.limit) } : {},
      ...typeof req.query.sortBy === "string" ? { sortBy: req.query.sortBy } : {},
      ...req.query.sortOrder === "asc" || req.query.sortOrder === "desc" ? { sortOrder: req.query.sortOrder } : {}
    });
    const filters = {};
    if (typeof req.query.role === "string") {
      const role = req.query.role.toLowerCase();
      if (!["student", "admin", "tutor"].includes(role)) {
        throw new AppError(httpStatus6.BAD_REQUEST, "Invalid user role");
      }
      filters.role = role.toUpperCase();
    }
    if (typeof req.query.email === "string" && req.query.email.trim()) {
      filters.email = req.query.email.trim();
    }
    if (typeof req.query.search === "string" && req.query.search.trim()) {
      filters.search = req.query.search.trim();
    }
    const result = await userServices.getUsers({
      ...paginationOptions,
      ...filters
    });
    res.status(httpStatus6.OK).json({
      success: true,
      message: result.message,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }
    console.error("Get users error:", error);
    return res.status(httpStatus6.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to retrieve users",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
var userController = {
  getUsers: getUsers2
};

// src/module/users/user.route.ts
var router7 = express7.Router();
router7.get("/", auth_default("ADMIN" /* ADMIN */), userController.getUsers);
var userRoutes = router7;

// src/app.ts
import path2 from "path";
var app = express8();
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000"
  // process.env.PROD_APP_URL, //Frontend production url
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/skill-bridge-client-server*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express8.json());
app.use("/api/user/current-user", currentUserRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/users", userRoutes);
app.use(express8.static(path2.join(__dirname, "../public")));
app.get("/", (req, res) => {
  res.sendFile(path2.join(__dirname, "../public", "index.html"));
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
