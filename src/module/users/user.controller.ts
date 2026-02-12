import { Request, Response } from "express";
import { userServices } from "./user.services";
import { AppError } from "../../utils/error";
import httpStatus from "http-status";
import paginationSortingHelper, { IOptions } from "../../utils/paginationSortingHelper";




const getUsers = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        // authorization
        if (!user?.id) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
        }

        if (user.role !== "ADMIN") {
            throw new AppError(httpStatus.FORBIDDEN, "Access denied: Admins only");
        }

        const paginationOptions: IOptions = paginationSortingHelper({
            ...(typeof req.query.page === "string" ? { page: Number(req.query.page) } : {}),
            ...(typeof req.query.limit === "string" ? { limit: Number(req.query.limit) } : {}),
            ...(typeof req.query.sortBy === "string" ? { sortBy: req.query.sortBy } : {}),
            ...(req.query.sortOrder === "asc" || req.query.sortOrder === "desc" ? { sortOrder: req.query.sortOrder } : {}),
        });

        const filters: {
            role?: string;
            email?: string;
            search?: string;
        } = {};


        // filters
        if (typeof req.query.role === "string") {
            const role = req.query.role.toLowerCase();
            if (!["student", "admin", "tutor"].includes(role)) {
                throw new AppError(httpStatus.BAD_REQUEST, "Invalid user role");
            }
            filters.role = role.toUpperCase();
        }

        if (typeof req.query.email === "string" && req.query.email.trim()) {
            filters.email = req.query.email.trim();
        }

        if (typeof req.query.search === "string" && req.query.search.trim()) {
            filters.search = req.query.search.trim();
        }

        const result = await userServices.getUsers({
            ...paginationOptions,
            ...filters,
        });


        res.status(httpStatus.OK).json({
            success: true,
            message: result.message,
            data: result.data,
            pagination: result.pagination,
        });
    } catch (error: any) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }

        console.error("Get users error:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to retrieve users",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};


const getUserById = async (req: Request, res: Response) => {
    try {
        const requestingUser = req.user;
        const { id } = req.params;

        // Authentication Check
        if (!requestingUser) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                "Authentication required. Please login."
            );
        }

        // Validation
        if (!id || typeof id !== "string") {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Valid user ID is required."
            );
        }


        const result = await userServices.getUserById(requestingUser, id);

        return res.status(httpStatus.OK).json({
            success: true,
            message: result.message,
            data: result.data,
        });

    } catch (error: any) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }

        console.error("Get user error:", error);

        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Something went wrong while retrieving the user.",
        });
    }
};




export const userController = {
    getUsers, getUserById
};
