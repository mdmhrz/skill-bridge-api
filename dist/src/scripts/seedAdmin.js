// prisma/seedAdmin.ts
import { UserRole } from "../enums/user.role.enum";
import { prisma } from "../lib/prisma";
// Load environment variables (ensure ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, BETTER_AUTH_URL are set)
if (!process.env.ADMIN_NAME || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.BETTER_AUTH_URL) {
    console.error("Missing environment variables for admin seeding!");
    process.exit(1);
}
async function seedAdmin() {
    try {
        console.log("*** Admin seeding started");
        const adminData = {
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
        };
        if (!adminData.name || !adminData.email || !adminData.password) {
            console.error("Missing admin data for seeding!");
            process.exit(1);
        }
        console.log("*** Checking if admin already exists...");
        const isExistUser = await prisma.user.findUnique({
            where: { email: adminData.email },
        });
        if (isExistUser) {
            console.log("Admin already exists. Seeding skipped.");
            return;
        }
        console.log("*** Creating user via Better Auth signup...");
        const signUpResponse = await fetch(`${process.env.BETTER_AUTH_URL}/api/auth/sign-up/email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": process.env.APP_URL
            },
            body: JSON.stringify(adminData),
        });
        if (!signUpResponse.ok) {
            const text = await signUpResponse.text();
            console.error("Admin signup failed:", text);
            return;
        }
        console.log("*** Admin user created successfully via Better Auth");
        console.log("*** Updating user to ADMIN role and verifying email...");
        const updatedAdmin = await prisma.user.update({
            where: { email: adminData.email },
            data: {
                role: UserRole.ADMIN,
                emailVerified: true,
            },
        });
        console.log("*** Admin role updated successfully:", updatedAdmin.email);
        console.log("*** Admin seeding completed");
    }
    catch (error) {
        console.error("!!Admin seeding failed:", error);
    }
    finally {
        await prisma.$disconnect();
        console.log("*** Prisma disconnected");
    }
}
// Run the seeder
seedAdmin();
//# sourceMappingURL=seedAdmin.js.map