import { Review } from "../../../generated/prisma/client";
type ReviewWithoutBooking = Omit<Review, 'bookingId'>;
export declare const reviewServices: {
    createReview: (payload: ReviewWithoutBooking) => Promise<{
        message: string;
        result: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            tutorProfileId: string;
            studentId: string;
            bookingId: string;
            comment: string | null;
            isVisible: boolean;
        };
    }>;
    updateReview: (reviewId: string, userId: string, payload: Partial<Pick<Review, "rating" | "comment">>) => Promise<{
        message: string;
        result: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            tutorProfileId: string;
            studentId: string;
            bookingId: string;
            comment: string | null;
            isVisible: boolean;
        };
    }>;
    deleteReview: (reviewId: string, userId: string) => Promise<{
        message: string;
        result: null;
    }>;
};
export {};
//# sourceMappingURL=review.services.d.ts.map