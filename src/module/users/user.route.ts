import express, { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../../enums/user.role.enum";
import { userController } from "./user.controller";

const router = express.Router();


router.get("/", auth(UserRole.ADMIN), userController.getUsers);




export const userRoutes: Router = router