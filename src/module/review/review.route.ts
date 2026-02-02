import express, { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../../enums/user.role.enum";
import { reviewController } from "./review.controller";

const router = express.Router();

router.post('/', auth(UserRole.STUDENT), reviewController.createReview);
// router.get("/", );
// router.get("/:id", );
// router.put("/", auth(UserRole.TUTOR), );
// router.delete("/", auth(UserRole.TUTOR), );



export const reviewRoutes: Router = router