import express, { Router } from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../../enums/user.role.enum";
import { categoryController } from "./category.controller";

const router = express.Router();

router.get("/", categoryController.getAllCategories);



export const categoryRoutes: Router = router