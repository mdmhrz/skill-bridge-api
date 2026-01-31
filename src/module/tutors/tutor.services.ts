import { TutorProfile } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createTutorProfile = async (userId: string, payload: TutorProfile) => {
    console.log(userId)

    const result = await prisma.tutorProfile.create({
        data: {
            ...payload,
            userId
        }
    })
    return result
};


// get all tutor profile
const getAllTutor = async () => {
    const [tutors, totalTeacher] = await Promise.all([
        prisma.tutorProfile.findMany(),
        prisma.tutorProfile.count(),
    ]);

    return { tutors, totalTeacher };
};


const getTutorById = async (id: string) => {
    return await prisma.tutorProfile.findUnique({
        where: {
            id
        }
    })
};



export const tutorServices = {
    createTutorProfile, getAllTutor, getTutorById
}