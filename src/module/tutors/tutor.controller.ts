import { Request, Response } from "express";
import { tutorServices } from "./tutor.services";
import { Prisma } from "../../../generated/prisma/client";


const createTutorProfile = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized: user information is missing",
            });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                message: "Request payload is required",
            });
        }

        const result = await tutorServices.createTutorProfile(
            user.id as string,
            req.body
        );

        return res.status(201).json({
            message: "Tutor profile created successfully",
            data: result,
        });
    } catch (error: any) {
        // Prisma known errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Unique constraint failed (user already has tutor profile)
            if (error.code === "P2002") {
                return res.status(409).json({
                    message: "Tutor profile already exists for this user",
                });
            }
        }

        return res.status(500).json({
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