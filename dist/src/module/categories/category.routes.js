import express from "express";
import auth from "../../middleware/auth";
import { UserRole } from "../../enums/user.role.enum";
import { categoryController } from "./category.controller";
const router = express.Router();
router.get("/", categoryController.getAllCategories);
router.post("/", auth(UserRole.ADMIN), categoryController.createCategory);
export const categoryRoutes = router;
//# sourceMappingURL=category.routes.js.map