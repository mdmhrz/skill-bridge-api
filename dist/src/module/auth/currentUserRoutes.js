import { Router } from "express";
import auth from "../../middleware/auth";
const router = Router();
router.get("/me", auth(), async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({
        message: "User data retrieved successfully",
        data: user,
    });
});
export const currentUserRoutes = router;
//# sourceMappingURL=currentUserRoutes.js.map