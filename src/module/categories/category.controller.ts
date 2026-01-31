import { Request, Response } from "express";
import { categoryServices } from "./category.services"

const getAllCategories = async (req: Request, res: Response) => {
    try {
        const result = await categoryServices.getAllCategories()
        if (!result) {
            return res.status(404).json({
                message: "Categories not found",
            });
        }
        return res.status(200).json({
            message: "Categories retrieved successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve categories",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export const categoryController = {
    getAllCategories
}

// controller