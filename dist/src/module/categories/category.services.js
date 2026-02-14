import { prisma } from "../../lib/prisma";
// get all categories
const getAllCategories = async () => {
    return await prisma.category.findMany();
};
const createCategory = async (payload) => {
    try {
        return await prisma.category.create({
            data: {
                name: payload.name,
                slug: payload.slug,
                description: payload.description ?? null,
                icon: payload.icon ?? null,
            },
        });
    }
    catch (error) {
        throw error;
    }
};
export const categoryServices = {
    getAllCategories, createCategory
};
//# sourceMappingURL=category.services.js.map