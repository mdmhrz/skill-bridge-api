import { IOptions } from "../../utils/paginationSortingHelper";
export type CreateTutorProfileDTO = {
    bio?: string;
    title?: string;
    experience?: number;
    hourlyRate: number;
    languages: string[];
    education?: string;
    categories: number[];
};
export interface GetTutorFilters extends IOptions {
    search?: string;
    rating?: number;
    totalReviews?: number;
    experience?: number;
    hourlyRate?: number;
}
export interface GetTutorFilters extends IOptions {
    search?: string;
    experience?: number;
}
export type UpdateTutorProfileDTO = {
    bio?: string;
    title?: string;
    experience?: number;
    hourlyRate?: number;
    languages?: string[];
    education?: string;
    categories?: number[];
    name?: string;
    image?: string;
    phone?: string;
};
export declare const tutorServices: {
    createTutorProfile: (userId: string, payload: CreateTutorProfileDTO) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client-runtime-utils").Decimal | null;
        totalReviews: number;
        experience: number | null;
        hourlyRate: import("@prisma/client-runtime-utils").Decimal;
        bio: string | null;
        title: string | null;
        isVerified: boolean;
        languages: string[];
        education: string | null;
        userId: string;
    }>;
    getAllTutors: (options?: GetTutorFilters) => Promise<{
        data: ({
            user: {
                name: string;
                email: string;
            };
            categories: ({
                category: {
                    name: string;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    slug: string;
                    description: string | null;
                    icon: string | null;
                    isActive: boolean;
                };
            } & {
                id: number;
                createdAt: Date;
                tutorProfileId: string;
                categoryId: number;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: import("@prisma/client-runtime-utils").Decimal | null;
            totalReviews: number;
            experience: number | null;
            hourlyRate: import("@prisma/client-runtime-utils").Decimal;
            bio: string | null;
            title: string | null;
            isVerified: boolean;
            languages: string[];
            education: string | null;
            userId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getTutorById: (id: string) => Promise<({
        user: {
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
        _count: {
            availability: number;
            reviews: number;
            bookings: number;
        };
        availability: {
            id: string;
            dayOfWeek: import("../../../generated/prisma/enums").DayOfWeek;
            startTime: string;
            endTime: string;
        }[];
        reviews: {
            id: string;
            rating: number;
            student: {
                name: string;
                id: string;
                email: string;
                image: string | null;
            };
            comment: string | null;
        }[];
        bookings: {
            id: string;
            scheduledDate: Date;
            student: {
                name: string;
                id: string;
                email: string;
                image: string | null;
            };
        }[];
        categories: {
            category: {
                name: string;
                id: number;
                description: string | null;
            };
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client-runtime-utils").Decimal | null;
        totalReviews: number;
        experience: number | null;
        hourlyRate: import("@prisma/client-runtime-utils").Decimal;
        bio: string | null;
        title: string | null;
        isVerified: boolean;
        languages: string[];
        education: string | null;
        userId: string;
    }) | null>;
    updateTutorProfile: (userId: string, payload: UpdateTutorProfileDTO) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client-runtime-utils").Decimal | null;
        totalReviews: number;
        experience: number | null;
        hourlyRate: import("@prisma/client-runtime-utils").Decimal;
        bio: string | null;
        title: string | null;
        isVerified: boolean;
        languages: string[];
        education: string | null;
        userId: string;
    }>;
    deleteTutorProfile: (userId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client-runtime-utils").Decimal | null;
        totalReviews: number;
        experience: number | null;
        hourlyRate: import("@prisma/client-runtime-utils").Decimal;
        bio: string | null;
        title: string | null;
        isVerified: boolean;
        languages: string[];
        education: string | null;
        userId: string;
    }>;
    getTutorOwnProfile: (userId: string) => Promise<({
        user: {
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
        _count: {
            availability: number;
            reviews: number;
            bookings: number;
        };
        availability: {
            id: string;
            dayOfWeek: import("../../../generated/prisma/enums").DayOfWeek;
            startTime: string;
            endTime: string;
        }[];
        reviews: {
            id: string;
            rating: number;
            student: {
                name: string;
                id: string;
                email: string;
                image: string | null;
            };
            comment: string | null;
        }[];
        bookings: {
            id: string;
            scheduledDate: Date;
            student: {
                name: string;
                id: string;
                email: string;
                image: string | null;
            };
        }[];
        categories: {
            category: {
                name: string;
                id: number;
                description: string | null;
            };
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: import("@prisma/client-runtime-utils").Decimal | null;
        totalReviews: number;
        experience: number | null;
        hourlyRate: import("@prisma/client-runtime-utils").Decimal;
        bio: string | null;
        title: string | null;
        isVerified: boolean;
        languages: string[];
        education: string | null;
        userId: string;
    }) | null>;
};
//# sourceMappingURL=tutor.services.d.ts.map