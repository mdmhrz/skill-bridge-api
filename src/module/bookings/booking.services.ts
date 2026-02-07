import { Booking } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/error";

const createBooking = async (studentId: string, payload: Booking) => {
    if (!studentId) {
        throw new AppError(401, "Unauthorized user");
    }

    if (!payload) {
        throw new AppError(400, "No data provided");
    }

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


    // Check if booking time is within tutor's availability
    const bookingDay = bookingDate.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    const bookingTimeInMinutes = bookingDate.getHours() * 60 + bookingDate.getMinutes();

    const availability = await prisma.availability.findMany({
        where: { tutorProfileId },
    });

    // If tutor has no availability at all
    if (!availability.length) {
        throw new AppError(404, "No availability set for this tutor");
    }

    // Check if booking fits in any availability slot
    const isAvailable = availability.some(avail => {

        if (!avail.startTime || !avail.endTime) return false;

        // Check if day matches
        if (avail.dayOfWeek !== bookingDay) return false;

        // Parse start & end times
        const [startHour, startMinute] = avail.startTime.split(":").map(Number);
        const [endHour, endMinute] = avail.endTime.split(":").map(Number);

        // Convert to minutes
        const startTimeInMinutes = startHour! * 60 + startMinute!;
        const endTimeInMinutes = endHour! * 60 + endMinute!;

        // Check if session fits in the slot
        return (
            bookingTimeInMinutes >= startTimeInMinutes &&
            bookingTimeInMinutes + duration * 60 <= endTimeInMinutes
        );
    });

    if (!isAvailable) {
        throw new AppError(400, "The selected time is outside the tutor's availability");
    }


    //  Prevent duplicate booking (same tutor + time) 
    const existingBooking = await prisma.booking.findFirst({
        where: {
            tutorProfileId,
            scheduledDate: bookingDate,
        },
    });

    if (existingBooking?.studentId === studentId) {
        throw new AppError(
            409,
            "You already have a booking at the selected time"
        );
    }


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


const getStudentBookings = async (studentId: string) => {
    // auth validation 
    if (!studentId) {
        throw new AppError(401, "Unauthorized user");
    }

    //  fetch bookings 
    const studentBookings = await prisma.booking.findMany({
        where: { studentId },
        orderBy: {
            scheduledDate: "desc",
        },
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    phone: true
                },
            },
            tutorProfile: {
                select: {
                    id: true,
                    user: {
                        select: {
                            name: true,
                            email: true,
                            image: true,
                            phone: true
                        },
                    },
                },
            },
        },
    });

    //  no bookings 
    if (!studentBookings || studentBookings.length === 0) {
        throw new AppError(404, "No bookings found for this student");
    }

    return {
        message: "Bookings retrieved successfully",
        studentBookings,
    };
};


const getBookingById = async (studentId: string, bookingId: string) => {
    // auth validation
    if (!studentId) {
        throw new AppError(401, "Unauthorized user");
    }


    // params validation 
    if (!bookingId) {
        throw new AppError(401, "No booking ID provided");
    }

    //  fetch booking 
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId, studentId },
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    phone: true
                },
            },
            tutorProfile: {
                select: {
                    id: true,
                    user: {
                        select: {
                            name: true,
                            email: true,
                            image: true,
                            phone: true
                        },
                    },
                },
            },
        },
    });

    //  no booking 
    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    return {
        message: "Booking retrieved successfully",
        booking,
    };
};



export const bookingServices = {
    createBooking, getStudentBookings, getBookingById
}