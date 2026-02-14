import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/error";
const createBooking = async (studentId, payload) => {
    if (!studentId) {
        throw new AppError(401, "Unauthorized user");
    }
    if (!payload) {
        throw new AppError(400, "No data provided");
    }
    const { tutorProfileId, categoryId, scheduledDate, duration, totalPrice, notes, meetingLink, } = payload;
    // ----------------------------
    // 1. Basic field validation
    // ----------------------------
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
    if (!totalPrice || Number(totalPrice) <= 0) {
        throw new AppError(400, "Total price must be greater than zero");
    }
    // ----------------------------
    // 2. Date validation (UTC-safe)
    // ----------------------------
    const bookingStart = new Date(scheduledDate);
    if (isNaN(bookingStart.getTime())) {
        throw new AppError(400, "Invalid scheduled date format");
    }
    if (bookingStart < new Date()) {
        throw new AppError(400, "You cannot book a session in the past");
    }
    const bookingEnd = new Date(bookingStart.getTime() + duration * 60 * 1000);
    // ----------------------------
    // 3. Tutor profile validation
    // ----------------------------
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { id: tutorProfileId },
    });
    if (!tutorProfile) {
        throw new AppError(404, "Tutor profile not found");
    }
    // ----------------------------
    // 4. Category validation
    // ----------------------------
    const category = await prisma.category.findUnique({
        where: { id: Number(categoryId) },
    });
    if (!category) {
        throw new AppError(404, "Category not found");
    }
    // ----------------------------
    // 5. Tutor–category validation
    // ----------------------------
    const tutorCategory = await prisma.tutorCategory.findUnique({
        where: {
            tutorProfileId_categoryId: {
                tutorProfileId,
                categoryId: Number(categoryId),
            },
        },
    });
    if (!tutorCategory) {
        throw new AppError(400, "This tutor does not provide sessions for this category");
    }
    // ----------------------------
    // 6. Availability validation
    // ----------------------------
    const bookingDay = bookingStart
        .toLocaleString("en-US", { weekday: "long", timeZone: "UTC" })
        .toUpperCase();
    const bookingStartMinutes = bookingStart.getUTCHours() * 60 + bookingStart.getUTCMinutes();
    const availability = await prisma.availability.findMany({
        where: { tutorProfileId, isActive: true },
    });
    if (!availability.length) {
        throw new AppError(404, "No availability set for this tutor");
    }
    const fitsAvailability = availability.some(avail => {
        if (avail.dayOfWeek !== bookingDay)
            return false;
        const [startHour, startMinute] = avail.startTime.split(":").map(Number);
        const [endHour, endMinute] = avail.endTime.split(":").map(Number);
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        return (bookingStartMinutes >= startMinutes &&
            bookingStartMinutes + duration <= endMinutes);
    });
    if (!fitsAvailability) {
        throw new AppError(400, "The selected time is outside the tutor's availability");
    }
    // ----------------------------
    // 7. Overlapping booking check (CRITICAL)
    // ----------------------------
    const dayStart = new Date(bookingStart);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(bookingStart);
    dayEnd.setUTCHours(23, 59, 59, 999);
    const existingBookings = await prisma.booking.findMany({
        where: {
            tutorProfileId,
            scheduledDate: {
                gte: dayStart,
                lte: dayEnd,
            },
            status: { not: "CANCELLED" },
        },
    });
    const hasOverlap = existingBookings.some(existing => {
        const existingStart = existing.scheduledDate;
        const existingEnd = new Date(existingStart.getTime() + existing.duration * 60 * 1000);
        return (bookingStart < existingEnd &&
            bookingEnd > existingStart);
    });
    if (hasOverlap) {
        throw new AppError(409, "This time slot is already booked. Please choose another available time.");
    }
    // ----------------------------
    // 8. Create booking
    // ----------------------------
    const booking = await prisma.booking.create({
        data: {
            studentId,
            tutorProfileId,
            categoryId,
            scheduledDate: bookingStart,
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
const getStudentBookings = async (studentId) => {
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
const getBookingById = async (studentId, bookingId) => {
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
};
//# sourceMappingURL=booking.services.js.map