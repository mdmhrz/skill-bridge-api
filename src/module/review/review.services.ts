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




// update review
const updateReview = async (
    reviewId: string,
    userId: string,
    payload: Partial<Pick<Review, "rating" | "comment">>
) => {
    // validation
    if (!reviewId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Review ID is required");
    }

    if (!payload || Object.keys(payload).length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Update data is required");
    }

    // fetch review
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
    });

    if (!review) {
        throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }

    // authorization
    if (review.studentId !== userId) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not allowed to update this review"
        );
    }

    const { rating, comment } = payload;

    // validate rating
    if (rating !== undefined && (rating < 1 || rating > 5)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Rating must be between 1 and 5"
        );
    }

    // build update data
    const updateData: any = {};
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;

    // update review
    const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: updateData,
    });

    return {
        message: "Review updated successfully",
        result: updatedReview,
    };
};



//delete review

const deleteReview = async (reviewId: string, userId: string) => {
    // validation
    if (!reviewId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Review ID is required");
    }

    // fetch review
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
    });

    if (!review) {
        throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }

    // authorization
    if (review.studentId !== userId) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not allowed to delete this review"
        );
    }

    // delete review
    await prisma.review.delete({
        where: { id: reviewId },
    });

    return {
        message: "Review deleted successfully",
        result: null,
    };
};

export const reviewServices = {
    createReview,
    updateReview,
    deleteReview,
};
