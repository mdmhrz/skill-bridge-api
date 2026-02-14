import { Availability } from "../../../generated/prisma/client";
export declare const availabilityServices: {
    createAvailability: (availability: Availability) => Promise<{
        message: string;
        result: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tutorProfileId: string;
            isActive: boolean;
            dayOfWeek: import("../../../generated/prisma/enums").DayOfWeek;
            startTime: string;
            endTime: string;
        };
    }>;
    updateAvailability: (availabilityId: string, userId: string, payload: Partial<Availability>) => Promise<{
        message: string;
        result: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tutorProfileId: string;
            isActive: boolean;
            dayOfWeek: import("../../../generated/prisma/enums").DayOfWeek;
            startTime: string;
            endTime: string;
        };
    }>;
};
//# sourceMappingURL=availability.services.d.ts.map