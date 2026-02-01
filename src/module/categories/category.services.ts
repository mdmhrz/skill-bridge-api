import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


// get all categories
const getAllCategories = async () => {
    return await prisma.category.findMany();
}

// create category


type CreateCategoryPayload = {
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
};
const createCategory = async (payload: CreateCategoryPayload) => {
    try {
        return await prisma.category.create({
            data: {
                name: payload.name,
                slug: payload.slug,
                description: payload.description ?? null,
                icon: payload.icon ?? null,
            },
        });
    } catch (error) {
        throw error;
    }
};


export const categoryServices = {
    getAllCategories, createCategory
}


