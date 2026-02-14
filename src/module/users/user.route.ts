import express, { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../../enums/user.role.enum";
import { userController } from "./user.controller";

const router = express.Router();


router.get("/", auth(UserRole.ADMIN), userController.getUsers);
router.get("/:id", auth(UserRole.ADMIN, UserRole.STUDENT), userController.getUserById)



export const userRoutes: Router = router