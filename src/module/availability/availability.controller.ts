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
            data: result.result,
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




const updateAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!user?.id) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                "Unauthorized access"
            );
        }

        if (!id) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Availability ID is required"
            );
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Update data is required"
            );
        }

        const result = await availabilityServices.updateAvailability(
            id as string,
            user.id,
            req.body
        );

        res.status(httpStatus.OK).json({
            success: true,
            message: result.message,
            data: result.result,
        });
    } catch (error: any) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }

        console.error("Update availability error:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to update availability",
        });
    }
};

export const availabilityController = {
    createAvailability, updateAvailability
};