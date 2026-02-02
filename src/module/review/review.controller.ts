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


// update review

const updateReview = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { id } = req.params;

        if (!user?.id) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
        }

        if (!id) {
            throw new AppError(httpStatus.BAD_REQUEST, "Review ID is required");
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            throw new AppError(httpStatus.BAD_REQUEST, "Update data is required");
        }

        const result = await reviewServices.updateReview(
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

        console.error("Update review error:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to update review",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};


//delete review

const deleteReview = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { id } = req.params;

        if (!user?.id) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
        }

        if (!id) {
            throw new AppError(httpStatus.BAD_REQUEST, "Review ID is required");
        }

        const result = await reviewServices.deleteReview(id as string, user.id);

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

        console.error("Delete review error:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to delete review",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const reviewController = {
    createReview,
    updateReview,
    deleteReview,
};
