import { tutorServices } from "./tutor.services";
import { Prisma } from "../../../generated/prisma/client";
import { AppError } from "../../utils/error";
import httpStatus from "http-status";
import paginationSortingHelper from "../../utils/paginationSortingHelper";
const createTutorProfile = async (req, res) => {
    try {
        // Check if user is authenticated
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: user information is missing",
            });
        }
        // Validate request body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Request payload is required",
            });
        }
        // validate required fields in body
        const { categories, hourlyRate, languages } = req.body;
        if (!categories || !Array.isArray(categories) || categories.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one category must be selected",
            });
        }
        if (!hourlyRate || typeof hourlyRate !== "number") {
            return res.status(400).json({
                success: false,
                message: "Hourly rate is required and must be a number",
            });
        }
        if (!languages || !Array.isArray(languages) || languages.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one language must be selected",
            });
        }
        // Call service layer
        const tutorProfile = await tutorServices.createTutorProfile(user.id, req.body);
        //  Success response
        return res.status(201).json({
            success: true,
            message: "Tutor profile created successfully",
            data: tutorProfile,
        });
    }
    catch (error) {
        // Prisma specific errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Unique constraint failed (user already has tutor profile)
            if (error.code === "P2002") {
                return res.status(409).json({
                    success: false,
                    message: "Tutor profile already exists for this user",
                });
            }
        }
        if (error.message === "User not found") {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (error.message === "User already has tutor profile") {
            return res.status(409).json({
                success: false,
                message: "User already has a tutor profile",
            });
        }
        // Catch-all server error
        console.error(" Failed to create tutor profile:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create tutor profile",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
// get all tutor
const getAllTutor = async (req, res) => {
    try {
        // Pagination & Sorting
        const paginationOptions = paginationSortingHelper({
            ...(typeof req.query.page === "string" && { page: Number(req.query.page) }),
            ...(typeof req.query.limit === "string" && { limit: Number(req.query.limit) }),
            ...(typeof req.query.sortBy === "string" && { sortBy: req.query.sortBy }),
            ...(req.query.sortOrder === "asc" || req.query.sortOrder === "desc"
                ? { sortOrder: req.query.sortOrder }
                : {}),
        });
        // Filters
        const filters = {};
        if (typeof req.query.search === "string" && req.query.search.trim()) {
            filters.search = req.query.search.trim();
        }
        if (req.query.experience && !isNaN(Number(req.query.experience))) {
            filters.experience = Number(req.query.experience);
        }
        const result = await tutorServices.getAllTutors({
            ...paginationOptions,
            ...filters,
        });
        return res.status(httpStatus.OK).json({
            success: true,
            message: "Tutor profiles retrieved successfully",
            data: result.data,
            meta: result.meta,
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        console.error("Get tutors error:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve tutor profiles",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
// get tutor by id
const getTutorById = async (req, res) => {
    try {
        const id = req.params.id;
        // Validate ID
        if (!id) {
            return res.status(400).json({
                message: "Tutor ID is required",
            });
        }
        const result = await tutorServices.getTutorById(id);
        // Handle not found
        if (!result) {
            return res.status(404).json({
                message: "Tutor profile not found --",
            });
        }
        // Success
        return res.status(200).json({
            message: "Tutor profile retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve tutor profile",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
const getTutorOwnProfile = async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        if (!user || !user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: user not authenticated",
            });
        }
        const result = await tutorServices.getTutorOwnProfile(user.id);
        // Handle not found
        if (!result) {
            return res.status(404).json({
                message: "Tutor profile not found",
            });
        }
        // Success
        return res.status(200).json({
            message: "Tutor profile retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve tutor profile",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
//update tutor profile controller
const updateTutorProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: user not authenticated",
            });
        }
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No update data provided",
            });
        }
        const { experience, hourlyRate, languages, name, phone, } = req.body;
        if (experience !== undefined && experience < 0) {
            return res.status(400).json({
                success: false,
                message: "Experience must be a positive number",
            });
        }
        if (hourlyRate !== undefined && hourlyRate <= 0) {
            return res.status(400).json({
                success: false,
                message: "Hourly rate must be greater than zero",
            });
        }
        if (languages !== undefined && !Array.isArray(languages)) {
            return res.status(400).json({
                success: false,
                message: "Languages must be an array of strings",
            });
        }
        if (phone !== undefined && typeof phone !== "string") {
            return res.status(400).json({
                success: false,
                message: "Phone must be a string",
            });
        }
        if (name !== undefined && typeof name !== "string") {
            return res.status(400).json({
                success: false,
                message: "Name must be a string",
            });
        }
        const updatedProfile = await tutorServices.updateTutorProfile(user.id, req.body);
        return res.status(200).json({
            success: true,
            message: "Tutor profile updated successfully",
            data: updatedProfile,
        });
    }
    catch (error) {
        if (error.message === "Tutor profile not found") {
            return res.status(404).json({
                success: false,
                message: "Tutor profile not found",
            });
        }
        if (error.message === "No data provided for update") {
            return res.status(400).json({
                success: false,
                message: "No update data provided",
            });
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(400).json({
                success: false,
                message: "Invalid update data",
            });
        }
        console.error("Failed to update tutor profile:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update tutor profile",
        });
    }
};
// delete tutor profile
const deleteTutorProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: user not authenticated",
            });
        }
        const deletedProfile = await tutorServices.deleteTutorProfile(user.id);
        return res.status(200).json({
            success: true,
            message: "Tutor profile deleted successfully",
            data: deletedProfile,
        });
    }
    catch (error) {
        if (error.message === "Tutor profile not found") {
            return res.status(404).json({
                success: false,
                message: "Tutor profile not found",
            });
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(400).json({
                success: false,
                message: "Failed to delete tutor profile",
            });
        }
        console.error("Failed to delete tutor profile:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete tutor profile",
        });
    }
};
export const tutorController = {
    createTutorProfile,
    getAllTutor,
    getTutorById,
    updateTutorProfile,
    deleteTutorProfile,
    getTutorOwnProfile
};
//# sourceMappingURL=tutor.controller.js.map