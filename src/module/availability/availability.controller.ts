import { Request, Response } from "express";
import { Availability } from "../../../generated/prisma/client";
import { AppError } from "../../utils/error";
import { availabilityServices } from "./availability.services";
import httpStatus from "http-status";


const createAvailability = async (req: Request, res: Response) => {
    try {

        if (!req.body) {
            throw new AppError(httpStatus.BAD_REQUEST, "Availability data is required");
        }


        const result = await availabilityServices.createAvailability(req.body);

        res.status(httpStatus.CREATED).json({
            success: true,
            message: result.message,
            data: result,
        });
    } catch (error: any) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }

        // unexpected errors
        console.error("Create availability error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create availability",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const availabilityController = {
    createAvailability
};