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


const updateAvailability = async (
    availabilityId: string,
    userId: string,
    payload: Partial<Availability>
) => {
    // validation
    if (!availabilityId) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Availability ID is required"
        );
    }

    // fetch availability with tutor
    const availability = await prisma.availability.findUnique({
        where: { id: availabilityId },
        include: {
            tutorProfile: true,
        },
    });

    if (!availability) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "Availability not found"
        );
    }

    // authorization
    if (availability.tutorProfile.userId !== userId) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not allowed to update this availability"
        );
    }

    const {
        dayOfWeek,
        startTime,
        endTime,
        isActive,
    } = payload;

    const finalStartTime = startTime ?? availability.startTime;
    const finalEndTime = endTime ?? availability.endTime;

    // time validation
    if (finalStartTime >= finalEndTime) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Start time must be earlier than end time"
        );
    }

    // overlap check
    const overlap = await prisma.availability.findFirst({
        where: {
            id: { not: availabilityId },
            tutorProfileId: availability.tutorProfileId,
            dayOfWeek: dayOfWeek ?? availability.dayOfWeek,
            OR: [
                {
                    startTime: { lte: finalStartTime },
                    endTime: { gt: finalStartTime },
                },
                {
                    startTime: { lt: finalEndTime },
                    endTime: { gte: finalEndTime },
                },
            ],
        },
    });

    if (overlap) {
        throw new AppError(
            httpStatus.CONFLICT,
            "Availability overlaps with an existing time slot"
        );
    }

    // build update data object
    const updateData: any = {};

    if (dayOfWeek !== undefined) updateData.dayOfWeek = dayOfWeek;
    if (startTime !== undefined) updateData.startTime = startTime;
    if (endTime !== undefined) updateData.endTime = endTime;
    if (isActive !== undefined) updateData.isActive = isActive;

    // update
    const result = await prisma.availability.update({
        where: { id: availabilityId },
        data: updateData,
    });

    return {
        message: "Availability updated successfully",
        result,
    };
};


export const availabilityServices = {
    createAvailability, updateAvailability
};