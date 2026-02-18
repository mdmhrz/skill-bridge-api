import { UserRole } from "../../enums/user.role.enum";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/error";
import paginationSortingHelper, { IOptions } from "../../utils/paginationSortingHelper";
import httpStatus from "http-status";

type ChartPoint = {
    label: string;
    value: number;
};

type BookingStatusPoint = {
    status: string;
    value: number;
};

const getLastMonths = (count: number) => {
    const months: { key: string; label: string; start: Date }[] = [];
    const now = new Date();

    for (let i = count - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
            label: date.toLocaleString("en-US", { month: "short" }),
            start: date,
        });
    }

    return months;
};

const mapDatesToMonthlySeries = (
    dates: Date[],
    months: { key: string; label: string }[]
): ChartPoint[] => {
    const bucket: Record<string, number> = {};

    for (const month of months) {
        bucket[month.key] = 0;
    }

    for (const date of dates) {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (bucket[key] !== undefined) {
            bucket[key] += 1;
        }
    }

    return months.map((month) => ({
        label: month.label,
        value: bucket[month.key] ?? 0,
    }));
};

export interface GetUsersFilters extends IOptions {
    role?: string;
    email?: string;
    search?: string;
}

const getUsers = async (options: GetUsersFilters = {}) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(options);

    const where: any = {};

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




const getUserById = async (
    requestingUser: { id: string, role: string; },
    id: string
) => {
    // Authorization
    const isOwner = requestingUser.id === id;
    const isAdmin = requestingUser.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not authorized to access this user's information."
        );
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
        throw new AppError(
            httpStatus.NOT_FOUND,
            "User not found."
        );
    }

    return {
        message: "User retrieved successfully.",
        data: user,
    };
};

export type UpdateStudentProfilePayload = {
    name?: string;
    phone?: string;
    image?: string;
};

const updateStudentProfile = async (
    requestingUser: { id: string; role: string },
    payload: UpdateStudentProfilePayload
) => {
    if (requestingUser.role !== UserRole.STUDENT) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "Access denied: Students only"
        );
    }

    if (!payload || Object.keys(payload).length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "No update data provided");
    }

    const updateData = {
        ...(payload.name !== undefined ? { name: payload.name } : {}),
        ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
        ...(payload.image !== undefined ? { image: payload.image } : {}),
    };

    if (Object.keys(updateData).length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "No valid profile fields provided");
    }

    const updatedUser = await prisma.user.update({
        where: { id: requestingUser.id },
        data: updateData,
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

    return {
        message: "Profile updated successfully.",
        data: updatedUser,
    };
};

const getAdminDashboardStats = async (requestingUser: { id: string; role: string }) => {
    if (!requestingUser?.id) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required. Please login.");
    }

    if (requestingUser.role !== UserRole.ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "Access denied: Admins only");
    }

    const now = new Date();
    const months = getLastMonths(6);
    const firstMonthStart = months[0]?.start ?? new Date(now.getFullYear(), now.getMonth(), 1);

    const [
        totalUsers,
        totalStudents,
        totalTutors,
        totalAdmins,
        activeUsers,
        inactiveUsers,
        bannedUsers,
        totalTutorProfiles,
        verifiedTutors,
        totalBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        ongoingBookings,
        upcomingBookings,
        pastBookings,
        bookingRevenue,
        totalReviews,
        visibleReviews,
        hiddenReviews,
        ratingAggregate,
        totalCategories,
        activeCategories,
        totalAvailabilitySlots,
        createdUsers,
        createdBookings,
        createdReviews,
        topCategories,
    ] = await prisma.$transaction([
        prisma.user.count(),
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.user.count({ where: { role: "TUTOR" } }),
        prisma.user.count({ where: { role: "ADMIN" } }),
        prisma.user.count({ where: { status: "ACTIVE" } }),
        prisma.user.count({ where: { status: "INACTIVE" } }),
        prisma.user.count({ where: { OR: [{ status: "BANNED" }, { isBanned: true }] } }),
        prisma.tutorProfile.count(),
        prisma.tutorProfile.count({ where: { isVerified: true } }),
        prisma.booking.count(),
        prisma.booking.count({ where: { status: "CONFIRMED" } }),
        prisma.booking.count({ where: { status: "COMPLETED" } }),
        prisma.booking.count({ where: { status: "CANCELLED" } }),
        prisma.booking.count({
            where: {
                scheduledDate: { lte: now },
                status: { in: ["CONFIRMED"] },
                completedAt: null,
                cancelledAt: null,
            },
        }),
        prisma.booking.count({
            where: {
                scheduledDate: { gt: now },
                status: { in: ["CONFIRMED"] },
            },
        }),
        prisma.booking.count({ where: { scheduledDate: { lt: now } } }),
        prisma.booking.aggregate({
            where: { status: "COMPLETED" },
            _sum: { totalPrice: true },
        }),
        prisma.review.count(),
        prisma.review.count({ where: { isVisible: true } }),
        prisma.review.count({ where: { isVisible: false } }),
        prisma.review.aggregate({ _avg: { rating: true } }),
        prisma.category.count(),
        prisma.category.count({ where: { isActive: true } }),
        prisma.availability.count(),
        prisma.user.findMany({
            where: { createdAt: { gte: firstMonthStart } },
            select: { createdAt: true },
        }),
        prisma.booking.findMany({
            where: { createdAt: { gte: firstMonthStart } },
            select: { createdAt: true },
        }),
        prisma.review.findMany({
            where: { createdAt: { gte: firstMonthStart } },
            select: { createdAt: true },
        }),
        prisma.category.findMany({
            take: 6,
            orderBy: {
                tutors: {
                    _count: "desc",
                },
            },
            select: {
                id: true,
                name: true,
                _count: {
                    select: {
                        tutors: true,
                    },
                },
            },
        }),
    ]);

    const pendingBookings = 0;

    const usersTrend = mapDatesToMonthlySeries(
        createdUsers.map((item) => item.createdAt),
        months
    );

    const bookingsTrend = mapDatesToMonthlySeries(
        createdBookings.map((item) => item.createdAt),
        months
    );

    const reviewsTrend = mapDatesToMonthlySeries(
        createdReviews.map((item) => item.createdAt),
        months
    );

    const bookingStatusBreakdown: BookingStatusPoint[] = [
        { status: "PENDING", value: pendingBookings },
        { status: "CONFIRMED", value: confirmedBookings },
        { status: "COMPLETED", value: completedBookings },
        { status: "CANCELLED", value: cancelledBookings },
    ];

    const topCategoryBreakdown: ChartPoint[] = topCategories.map((category) => ({
        label: category.name,
        value: category._count.tutors,
    }));

    return {
        message: "Admin dashboard statistics retrieved successfully",
        data: {
            overview: {
                totalUsers,
                totalStudents,
                totalTutors,
                totalAdmins,
                activeUsers,
                inactiveUsers,
                bannedUsers,
                totalTutorProfiles,
                verifiedTutors,
                totalBookings,
                ongoingBookings,
                upcomingBookings,
                pastBookings,
                totalReviews,
                visibleReviews,
                hiddenReviews,
                totalCategories,
                activeCategories,
                totalAvailabilitySlots,
                completedRevenue: Number(bookingRevenue._sum.totalPrice ?? 0),
                averageRating: Number((ratingAggregate._avg.rating ?? 0).toFixed(2)),
            },
            charts: {
                usersTrend,
                bookingsTrend,
                reviewsTrend,
                bookingStatusBreakdown,
                topCategoryBreakdown,
            },
        },
    };
};



export const userServices = {
    getUsers,
    getUserById,
    updateStudentProfile,
    getAdminDashboardStats,
};
