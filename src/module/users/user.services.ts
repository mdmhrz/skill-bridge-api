import { prisma } from "../../lib/prisma";
import paginationSortingHelper, { IOptions } from "../../utils/paginationSortingHelper";

export interface GetUsersFilters extends IOptions {
    role?: string;
    email?: string;
}

const getUsers = async (options: GetUsersFilters = {}) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(options);

    const where: any = {};
    if (options.role) where.role = options.role;
    if (options.email) where.email = { contains: options.email, mode: "insensitive" };

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

export const userServices = {
    getUsers,
};
