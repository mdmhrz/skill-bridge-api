export declare const Role: {
    readonly STUDENT: "STUDENT";
    readonly TUTOR: "TUTOR";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const UserStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly BANNED: "BANNED";
    readonly INACTIVE: "INACTIVE";
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export declare const BookingStatus: {
    readonly CONFIRMED: "CONFIRMED";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
export declare const DayOfWeek: {
    readonly MONDAY: "MONDAY";
    readonly TUESDAY: "TUESDAY";
    readonly WEDNESDAY: "WEDNESDAY";
    readonly THURSDAY: "THURSDAY";
    readonly FRIDAY: "FRIDAY";
    readonly SATURDAY: "SATURDAY";
    readonly SUNDAY: "SUNDAY";
};
export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];
//# sourceMappingURL=enums.d.ts.map