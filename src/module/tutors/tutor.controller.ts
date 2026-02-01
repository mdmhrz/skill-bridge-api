import { Request, Response } from "express";
import { tutorServices } from "./tutor.services";
import { Prisma } from "../../../generated/prisma/client";


const createTutorProfile = async (req: Request, res: Response) => {
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
        const tutorProfile = await tutorServices.createTutorProfile(
            user.id as string,
            req.body
        );

        //  Success response
        return res.status(201).json({
            success: true,
            message: "Tutor profile created successfully",
            data: tutorProfile,
        });
    } catch (error: any) {
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


const getAllTutor = async (req: Request, res: Response) => {
    try {
        const result = await tutorServices.getAllTutor();

        return res.status(200).json({
            message: "Tutor profiles retrieved successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve tutor profiles",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};


const getTutorById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        // Validate ID
        if (!id) {
            return res.status(400).json({
                message: "Tutor ID is required",
            });
        }

        const result = await tutorServices.getTutorById(id as string);

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
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve tutor profile",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};



export const tutorController = {
    createTutorProfile, getAllTutor, getTutorById
}