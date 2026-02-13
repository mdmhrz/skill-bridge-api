import express, { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../enums/user.role.enum";

const router = express.Router();

router.post('/', auth(UserRole.STUDENT), tutorController.createTutorProfile);
router.get("/", tutorController.getAllTutor); //to do: only ifVerified profile will be shown
router.get('/my-profile', auth(UserRole.TUTOR), tutorController.getTutorOwnProfile)
router.get("/:id", tutorController.getTutorById);
router.put("/", auth(UserRole.TUTOR), tutorController.updateTutorProfile);
router.delete("/", auth(UserRole.TUTOR), tutorController.deleteTutorProfile);



export const tutorRoutes: Router = router