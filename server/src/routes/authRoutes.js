import { Router } from "express";
import { requireAuth, attachUser } from "../middleware/auth.js";
import { getMe } from "../controllers/authController.js";

const router = Router();

router.get("/me", requireAuth, attachUser, getMe);

export default router;
