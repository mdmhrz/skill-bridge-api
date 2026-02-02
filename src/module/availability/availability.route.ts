import express, { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../../enums/user.role.enum";
import { availabilityController } from "./availability.controller";

const router = express.Router();

router.post('/', auth(UserRole.TUTOR), availabilityController.createAvailability);
router.put('/:id', auth(UserRole.TUTOR), availabilityController.updateAvailability);




export const availabilityRoutes: Router = router