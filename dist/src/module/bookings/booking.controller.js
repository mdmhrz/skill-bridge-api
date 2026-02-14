import { bookingServices } from "./booking.services";
import { AppError } from "../../utils/error";
const createBooking = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }
        const result = await bookingServices.createBooking(user.id, req.body);
        return res.status(201).json({
            success: true,
            message: result.message,
            data: result.booking,
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        // unexpected errors
        console.error("Create booking error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
const getStudentBookings = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }
        const result = await bookingServices.getStudentBookings(user.id);
        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.studentBookings,
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        console.error("Get student bookings error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
const getBookingById = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }
        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                message: "Booking ID is required",
            });
        }
        const result = await bookingServices.getBookingById(user.id, req.params.id);
        return res.status(200).json({
            success: true,
            message: result.message,
            data: result.booking,
        });
    }
    catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        console.error("Get student bookings error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export const bookingController = {
    createBooking, getStudentBookings, getBookingById
};
//# sourceMappingURL=booking.controller.js.map