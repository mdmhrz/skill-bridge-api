import { UserRole } from "../../enums/user.role.enum";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/error";
import paginationSortingHelper from "../../utils/paginationSortingHelper";
import httpStatus from "http-status";
const getUsers = async (options = {}) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(options);
    const where = {};
    if (options.role) {
        where.role = options.role;
    }
    if (options.email) {
        where.email = {
            contains: options.email,
            mode: "insensitive",
        };
    }
    if (options.search) {
        where.OR = [
            { name: { contains: options.search, mode: "insensitive" } },
            { email: { contains: options.search, mode: "insensitive" } },
        ];
    }
    const totalUsers = await prisma.user.count({ where });
    const users = await prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return {
        message: "Users retrieved successfully",
        data: users,
        pagination: {
            total: totalUsers,
            page,
            limit,
            totalPages: Math.ceil(totalUsers / limit),
        },
    };
};
const getUserById = async (requestingUser, id) => {
    // Authorization
    const isOwner = requestingUser.id === id;
    const isAdmin = requestingUser.role === UserRole.ADMIN;
    if (!isOwner && !isAdmin) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to access this user's information.");
    }
    // Fetch user
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            studentBookings: true,
            reviews: true,
            _count: {
                select: {
                    studentBookings: true,
                    reviews: true,
                },
            },
        },
    });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found.");
    }
    return {
        message: "User retrieved successfully.",
        data: user,
    };
};
export const userServices = {
    getUsers, getUserById
};
//# sourceMappingURL=user.services.js.map