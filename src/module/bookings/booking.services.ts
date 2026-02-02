import { Booking } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/error";

const createBooking = async (studentId: string, payload: Booking) => {
    if (!studentId) {
        throw new AppError(401, "Unauthorized user");
    }

    console.log(studentId)

    const {
        tutorProfileId,
        categoryId,
        scheduledDate,
        duration,
        totalPrice,
        notes,
        meetingLink,
    } = payload;

    // Required fields
    if (!tutorProfileId) {
        throw new AppError(400, "Tutor profile ID is required");
    }

    if (!categoryId) {
        throw new AppError(400, "Category ID is required");
    }

    if (!scheduledDate) {
        throw new AppError(400, "Scheduled date is required");
    }

    if (!duration || duration <= 0) {
        throw new AppError(400, "Duration must be greater than zero");
    }

    if (!totalPrice || (Number(totalPrice)) <= 0) {
        throw new AppError(400, "Total price must be greater than zero");
    }

    //  Date validation 
    const bookingDate = new Date(scheduledDate);
    if (isNaN(bookingDate.getTime())) {
        throw new AppError(400, "Invalid scheduled date format");
    }

    if (bookingDate < new Date()) {
        throw new AppError(400, "You cannot book a session in the past");
    }

    //  Tutor profile 
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { id: tutorProfileId },
    });

    if (!tutorProfile) {
        throw new AppError(404, "Tutor profile not found");
    }

    //  Category 
    const category = await prisma.category.findUnique({
        where: { id: Number(categoryId) },
    });

    if (!category) {
        throw new AppError(404, "Category not found");
    }

    //  Tutor-category relationship 
    const tutorCategory = await prisma.tutorCategory.findFirst({
        where: {
            tutorProfileId,
            categoryId: Number(categoryId),
        },
    });

    if (!tutorCategory) {
        throw new AppError(
            400,
            "This tutor does not provide sessions for this category"
        );
    }

    //  Prevent duplicate booking (same tutor + time) 
    const existingBooking = await prisma.booking.findFirst({
        where: {
            tutorProfileId,
            scheduledDate: bookingDate,
        },
    });

    if (existingBooking) {
        throw new AppError(
            409,
            "This tutor already has a booking at the selected time"
        );
    }

    //  Create booking 
    const booking = await prisma.booking.create({
        data: {
            studentId,
            tutorProfileId,
            categoryId,
            scheduledDate: bookingDate,
            duration,
            totalPrice,
            notes: notes || null,
            meetingLink: meetingLink || null,
        },
    });

    return {
        message: "Booking created successfully",
        booking,
    };
};



export const bookingServices = {
    createBooking
}