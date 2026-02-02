import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/error";
import httpStatus from "http-status";
import { Review } from "../../../generated/prisma/client";

const createReview = async (payload: Review) => {
    const { bookingId, studentId, tutorProfileId, rating, comment } = payload;

    // Required fields
    if (!bookingId || !studentId || !tutorProfileId || !rating) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "bookingId, studentId, tutorProfileId, and rating are required"
        );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Rating must be between 1 and 5"
        );
    }

    // Check booking existence
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
    });

    if (!booking) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Booking not found"
        );
    }

    // Check reviewer is the booking student
    if (booking.studentId !== studentId) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You can only review bookings you made"
        );
    }

    // Prevent duplicate review
    const existingReview = await prisma.review.findUnique({
        where: { bookingId },
    });

    if (existingReview) {
        throw new AppError(
            httpStatus.CONFLICT,
            "A review for this booking already exists"
        );
    }

    // Ensure tutorProfile exists
    const tutor = await prisma.tutorProfile.findUnique({
        where: { id: tutorProfileId },
    });

    if (!tutor) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Tutor profile not found"
        );
    }

    // Create review
    const review = await prisma.review.create({
        data: {
            bookingId,
            studentId,
            tutorProfileId,
            rating,
            comment: comment || null,
        },
    });

    return {
        message: "Review created successfully",
        result: review,
    };
};

export const reviewServices = {
    createReview,
};