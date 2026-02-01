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


//create category
const createCategory = async (req: Request, res: Response) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "Request payload is required",
            });
        }

        const result = await categoryServices.createCategory(req.body)

        if (!result) {
            return res.status(404).json({
                message: "Category not found",
            });
        }
        return res.status(200).json({
            message: "Category created successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create category",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export const categoryController = {
    getAllCategories, createCategory
}

// controller