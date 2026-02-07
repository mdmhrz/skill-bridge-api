import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from 'nodemailer'


// Node mailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  }
});


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: ["https://skill-bridge-client-server.vercel.app/"], //process.env.PROD_APP_URL!
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 * 60 * 24, // 5 days 
    },
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    sameSite: "none",
    crossSubDomainCookies: {
      enabled: true,
    },
    disableCSRFCheck: true,
  },



  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        input: false,
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
      // const APP_URL = process.env.APP_URL
      // console.log(APP_URL)
      //   const verificationURL = `${APP_URL}/verify-email?token=${token}`
      const verificationURL = url

      try {
        const info = await transporter.sendMail({
          from: '"Skill Bridge" <skill_bridge@gmail.com>',
          to: user.email,
          subject: "Email Verification",
          text: "Hello world?", // Plain-text version of the message
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
        <p>Hi 👋,${user.name}</p>

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
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <div class="link-box">
          ${verificationURL}
        </div>

        <p style="margin-top: 24px;">
          If you didn’t create an account, you can safely ignore this email.
        </p>

        <p>
          — <br />
          The <strong>Skill Bridge</strong> Team
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        © 2026 <span>Skill Bridge</span>. All rights reserved.
      </div>
    </div>
  </body>
</html>

                `, // HTML version of the message
        });


        console.log('***** verification email send!');
      } catch (err) {
        console.log('verify email send fail');
        throw err
      }
    },
  },


  baseURL: process.env.BETTER_AUTH_URL,
  // Social Login Implementation
  socialProviders: {
    google: {
      prompt: 'select_account consent',
      accessType: 'offline',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

});