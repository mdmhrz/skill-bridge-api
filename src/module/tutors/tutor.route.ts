import express, { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post('/', auth(), tutorController.createTutorProfile);
router.get("/", tutorController.getAllTutor);
router.get("/:id", tutorController.getTutorById);



export const tutorRoutes: Router = router