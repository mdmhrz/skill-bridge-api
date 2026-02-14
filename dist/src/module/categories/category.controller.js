import { categoryServices } from "./category.services";
import { Prisma } from "../../../generated/prisma/client";
const getAllCategories = async (req, res) => {
    try {
        const result = await categoryServices.getAllCategories();
        if (!result) {
            return res.status(404).json({
                message: "Categories not found",
            });
        }
        return res.status(200).json({
            message: "Categories retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve categories",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
//create category
const createCategory = async (req, res) => {
    try {
        // Validate request body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Request payload is required",
            });
        }
        const { name, slug, description } = req.body;
        // Required field validation
        if (!name || typeof name !== "string") {
            return res.status(400).json({
                success: false,
                message: "Category name is required and must be a string",
            });
        }
        if (!slug || typeof slug !== "string") {
            return res.status(400).json({
                success: false,
                message: "Category slug is required and must be a string",
            });
        }
        // Slug validation (SEO + safety)
        const normalizedSlug = slug
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");
        if (!/^[a-z0-9-]+$/.test(normalizedSlug)) {
            return res.status(400).json({
                success: false,
                message: "Slug can only contain lowercase letters, numbers, and hyphens",
            });
        }
        // Create category
        const category = await categoryServices.createCategory({
            name: name.trim(),
            slug: normalizedSlug,
            description: description?.trim() || null,
        });
        // Success response
        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    }
    catch (error) {
        // Prisma unique constraint handling
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return res.status(409).json({
                    success: false,
                    message: "Category with this name or slug already exists",
                });
            }
        }
        // Server error fallback
        return res.status(500).json({
            success: false,
            message: "Failed to create category",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
export const categoryController = {
    getAllCategories, createCategory
};
// controller
//# sourceMappingURL=category.controller.js.map