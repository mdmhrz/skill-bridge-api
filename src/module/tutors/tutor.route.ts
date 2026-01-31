import express, { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post('/', auth(), tutorController.createTutorProfile )



export const tutorRoutes: Router = router