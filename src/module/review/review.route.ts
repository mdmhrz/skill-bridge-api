import express, { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../../enums/user.role.enum";
import { reviewController } from "./review.controller";

const router = express.Router();

router.post('/', auth(UserRole.STUDENT), reviewController.createReview);
router.put("/:id", auth(UserRole.STUDENT), reviewController.updateReview);
router.delete("/:id", auth(UserRole.STUDENT), reviewController.deleteReview);
// router.get("/", );
// router.get("/:id", );



export const reviewRoutes: Router = router