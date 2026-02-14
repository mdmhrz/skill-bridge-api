import express from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../../enums/user.role.enum";
import { bookingController } from "./booking.controller";
const router = express.Router();
// router.get("/");
router.post("/", auth(UserRole.STUDENT), bookingController.createBooking);
router.get("/", auth(UserRole.STUDENT, UserRole.ADMIN), bookingController.getStudentBookings);
router.get('/:id', auth(UserRole.STUDENT, UserRole.ADMIN), bookingController.getBookingById);
export const bookingRoutes = router;
//# sourceMappingURL=booking.route.js.map