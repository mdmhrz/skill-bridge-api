import { Request, Response } from "express";
import { Booking } from "../../../generated/prisma/client";
import { bookingServices } from "./booking.services";
import { AppError } from "../../utils/error";

const createBooking = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        if (!user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }

        const result = await bookingServices.createBooking(user.id, req.body);

        return res.status(201).json({
            success: true,
            message: result.message,
            data: result.booking,
        });
    } catch (error: any) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }

        // unexpected errors
        console.error("Create booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const bookingController = {
    createBooking
}