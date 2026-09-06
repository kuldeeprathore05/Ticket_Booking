import { Router } from "express";
import { requireAuth, attachUser } from "../middleware/auth.js";
import { createPaymentOrder, verifyPayment } from "../controllers/paymentController.js";

const router = Router();

router.use(requireAuth, attachUser);

router.post("/create", createPaymentOrder);
router.post("/verify", verifyPayment);

export default router;
