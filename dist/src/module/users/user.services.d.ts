import { IOptions } from "../../utils/paginationSortingHelper";
export interface GetUsersFilters extends IOptions {
    role?: string;
    email?: string;
}
export interface GetUsersFilters extends IOptions {
    role?: string;
    email?: string;
    search?: string;
}
export declare const userServices: {
    getUsers: (options?: GetUsersFilters) => Promise<{
        message: string;
        data: {
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUserById: (requestingUser: {
        id: string;
        role: string;
    }, id: string) => Promise<{
        message: string;
        data: {
            _count: {
                studentBookings: number;
                reviews: number;
            };
            studentBookings: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                tutorProfileId: string;
                categoryId: string | null;
                studentId: string;
                scheduledDate: Date;
                duration: number;
                totalPrice: import("@prisma/client-runtime-utils").Decimal;
                status: import("../../../generated/prisma/enums").BookingStatus;
                notes: string | null;
                meetingLink: string | null;
                cancellationReason: string | null;
                cancelledAt: Date | null;
                completedAt: Date | null;
            }[];
            reviews: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                rating: number;
                tutorProfileId: string;
                studentId: string;
                bookingId: string;
                comment: string | null;
                isVisible: boolean;
            }[];
        } & {
            name: string;
            role: import("../../../generated/prisma/enums").Role;
            phone: string | null;
            isBanned: boolean;
            bannedReason: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            image: string | null;
            status: import("../../../generated/prisma/enums").UserStatus;
        };
    }>;
};
//# sourceMappingURL=user.services.d.ts.map