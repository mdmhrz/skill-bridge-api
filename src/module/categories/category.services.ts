import { prisma } from "../../lib/prisma";

const getAllCategories = async()=>{
    return await prisma.category.findMany();
}


export const categoryServices = {
    getAllCategories
}