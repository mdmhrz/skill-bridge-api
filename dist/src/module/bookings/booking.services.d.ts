import { Booking } from "../../../generated/prisma/client";
export declare const bookingServices: {
    createBooking: (studentId: string, payload: Booking) => Promise<{
        message: string;
        booking: {
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
        };
    }>;
    getStudentBookings: (studentId: string) => Promise<{
        message: string;
        studentBookings: ({
            tutorProfile: {
                user: {
                    name: string;
                    phone: string | null;
                    email: string;
                    image: string | null;
                };
                id: string;
            };
            student: {
                name: string;
                phone: string | null;
                id: string;
                image: string | null;
            };
        } & {
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
        })[];
    }>;
    getBookingById: (studentId: string, bookingId: string) => Promise<{
        message: string;
        booking: {
            tutorProfile: {
                user: {
                    name: string;
                    phone: string | null;
                    email: string;
                    image: string | null;
                };
                id: string;
            };
            student: {
                name: string;
                phone: string | null;
                id: string;
                image: string | null;
            };
        } & {
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
        };
    }>;
};
//# sourceMappingURL=booking.services.d.ts.map