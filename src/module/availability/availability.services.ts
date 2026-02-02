import { Availability } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/error";
import httpStatus from "http-status";

const createAvailability = async (availability: Availability) => {
    const {
        tutorProfileId,
        dayOfWeek,
        startTime,
        endTime,
    } = availability;

    // Validation: required fields
    if (!tutorProfileId || !dayOfWeek || !startTime || !endTime) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Tutor profile, day, start time and end time are required"
        );
    }

    // Time validation
    if (startTime >= endTime) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Start time must be earlier than end time"
        );
    }

    // Ensure tutor profile exists
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { id: tutorProfileId },
    });

    if (!tutorProfile) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Tutor profile not found"
        );
    }

    // Prevent duplicate availability (same day & overlapping time)
    const existingAvailability = await prisma.availability.findFirst({
        where: {
            tutorProfileId,
            dayOfWeek,
            OR: [
                {
                    startTime: { lte: startTime },
                    endTime: { gt: startTime },
                },
                {
                    startTime: { lt: endTime },
                    endTime: { gte: endTime },
                },
            ],
        },
    });

    if (existingAvailability) {
        throw new AppError(
            httpStatus.CONFLICT,
            "Availability already exists for this time slot"
        );
    }

    // Create availability
    const result = await prisma.availability.create({
        data: availability,
    });

    return {
        message: "Availability created successfully",
        result
    };
};

export const availabilityServices = {
    createAvailability
};