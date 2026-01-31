import { TutorProfile } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"


type CreateTutorProfileDTO = {
    bio?: string;
    title?: string;
    experience?: number;
    hourlyRate: number;
    languages: string[];
    education?: string;
    categories: number[];
};

const createTutorProfile = async (userId: string, payload: CreateTutorProfileDTO) => {
    const { categories, ...rest } = payload;

    const result = await prisma.tutorProfile.create({
        data: {
            userId,
            ...rest,
            categories: {
                create: categories.map((categoryId) => ({
                    category: {
                        connect: { id: categoryId },
                    },
                })),
            },
        },
    });

    return result;
};


// get all tutor profile
const getAllTutor = async () => {
    const [tutors, totalTeacher] = await Promise.all([
        prisma.tutorProfile.findMany({
            include: {
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
        }),
        prisma.tutorProfile.count(),
    ]);

    return { tutors, totalTeacher };
};


const getTutorById = async (id: string) => {
    return await prisma.tutorProfile.findUnique({
        where: {
            id
        },
        include: {
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



export const tutorServices = {
    createTutorProfile, getAllTutor, getTutorById
}