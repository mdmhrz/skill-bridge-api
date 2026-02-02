import { Request, Response } from "express";
import { reviewServices } from "./review.services";
import { AppError } from "../../utils/error";
import httpStatus from "http-status";

const createReview = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        if (!user?.id) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                "Unauthorized access"
            );
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Review data is required"
            );
        }

        // force studentId from logged-in user
        const payload = {
            ...req.body,
            studentId: user.id,
        };

        const result = await reviewServices.createReview(payload);

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

        console.error("Create review error:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to create review",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const reviewController = {
    createReview,
};
