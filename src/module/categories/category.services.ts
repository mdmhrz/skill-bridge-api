import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


// get all categories
const getAllCategories = async () => {
    return await prisma.category.findMany();
}

// create category
const createCategory = async (payload: Category) => {

    return await prisma.category.create({
        data: payload
    })
}


export const categoryServices = {
    getAllCategories, createCategory
}


