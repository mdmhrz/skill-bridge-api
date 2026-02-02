import { TutorProfile } from "../../../generated/prisma/client"
import { UserRole } from "../../enums/user.role.enum";
import { prisma } from "../../lib/prisma"

export type CreateTutorProfileDTO = {
    bio?: string;
    title?: string;
    experience?: number;
    hourlyRate: number;
    languages: string[];
    education?: string;
    categories: number[];
};

const createTutorProfile = async (
    userId: string,
    payload: CreateTutorProfileDTO
) => {
    const { categories, ...rest } = payload;



    // Validate input
    if (!userId) throw new Error("User ID is required");
    if (!categories || categories.length === 0) throw new Error("At least one category must be selected");

    console.log(`*** Starting tutor profile creation for user: ${userId}`);

    try {
        // Atomic transaction
        const tutorProfile = await prisma.$transaction(async (tx) => {

            //check if user exists
            console.log("*** Checking if user exists...");
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) throw new Error("User not found");


            //is user already has tutor profile
            console.log("*** Checking if user already has tutor profile...");
            const existingProfile = await tx.tutorProfile.findUnique({
                where: { userId },
            });

            if (existingProfile) throw new Error("User already has tutor profile");


            //finally create tutor profile
            console.log("*** Creating tutor profile...");
            const profile = await tx.tutorProfile.create({
                data: {
                    userId,
                    ...rest,
                    categories: {
                        create: categories.map((categoryId) => ({
                            category: { connect: { id: categoryId } },
                        })),
                    },
                },
            });

            if (!profile) throw new Error("Tutor profile not created");


            //update user role
            console.log("*** Updating user role to TUTOR...");
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: { role: UserRole.TUTOR },
            });

            if (!updatedUser) throw new Error("User role not updated");

            console.log("*** Tutor profile created and role updated successfully");
            return profile;
        });

        return tutorProfile;
    } catch (error: any) {
        console.error("Failed to create tutor profile:", error.message || error);
        throw error; // re-throw for API layer to handle
    }
};


// get all tutor profile
const getAllTutor = async () => {
    try {
        const [tutors, totalTeacher] = await Promise.all([
            prisma.tutorProfile.findMany({
                // where: {
                //     isVerified: true
                // },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        },
                    },
                    categories: {
                        select: {
                            category: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.tutorProfile.count(),
        ]);

        return { tutors, totalTeacher };
    } catch (error) {
        throw new Error("Unable to fetch tutor profiles from database");
    }
};



// get tutor by id
const getTutorById = async (id: string) => {
    return await prisma.tutorProfile.findUnique({
        where: {
            id
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                },
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
    })
};




// update totor profile


export type UpdateTutorProfileDTO = {
    // Tutor profile fields
    bio?: string;
    title?: string;
    experience?: number;
    hourlyRate?: number;
    languages?: string[];
    education?: string;
    categories?: number[];

    // User profile fields
    name?: string;
    image?: string;
    phone?: string;
};


const updateTutorProfile = async (
    userId: string,
    payload: UpdateTutorProfileDTO
) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    if (!payload || Object.keys(payload).length === 0) {
        throw new Error("No data provided for update");
    }

    try {
        const updatedProfile = await prisma.$transaction(async (tx) => {
            const existingProfile = await tx.tutorProfile.findUnique({
                where: { userId },
            });

            if (!existingProfile) {
                throw new Error("Tutor profile not found");
            }

            // Separate payloads
            const {
                categories,
                name,
                image,
                phone,
                ...tutorProfileData
            } = payload;

            // Update user profile if user fields exist
            if (name || image || phone) {
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        ...(name && { name }),
                        ...(image && { image }),
                        ...(phone && { phone }),
                    },
                });
            }

            // Update tutor profile
            const profile = await tx.tutorProfile.update({
                where: { userId },
                data: tutorProfileData,
            });

            // Update categories if provided
            if (categories && categories.length > 0) {
                await tx.tutorCategory.deleteMany({
                    where: { tutorProfileId: profile.id },
                });

                await tx.tutorCategory.createMany({
                    data: categories.map((categoryId) => ({
                        tutorProfileId: profile.id,
                        categoryId,
                    })),
                });
            }

            return profile;
        });

        return updatedProfile;
    } catch (error) {
        throw error;
    }
};



// delete tutor profile
const deleteTutorProfile = async (userId: string) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const existingProfile = await tx.tutorProfile.findUnique({
                where: { userId },
            });

            if (!existingProfile) {
                throw new Error("Tutor profile not found");
            }

            // Delete associated categories
            await tx.tutorCategory.deleteMany({
                where: {
                    tutorProfileId: existingProfile.id,
                },
            });

            // Delete tutor profile
            await tx.tutorProfile.delete({
                where: { userId },
            });

            // Update user role
            await tx.user.update({
                where: { id: userId },
                data: {
                    role: UserRole.STUDENT,
                },
            });

            return existingProfile;
        });

        return result;
    } catch (error) {
        throw error;
    }
};






export const tutorServices = {
    createTutorProfile,
    getAllTutor,
    getTutorById,
    updateTutorProfile,
    deleteTutorProfile
}