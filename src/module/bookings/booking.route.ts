import express, { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../../enums/user.role.enum";
import { bookingController } from "./booking.controller";


const router = express.Router();

// router.get("/");
router.post("/", auth(UserRole.STUDENT), bookingController.createBooking);



export const bookingRoutes: Router = router