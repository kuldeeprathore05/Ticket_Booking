import { Router } from "express";
import { requireAuth, attachUser } from "../middleware/auth.js";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelPendingBooking,
} from "../controllers/bookingController.js";

const router = Router();

router.use(requireAuth, attachUser);

router.post("/", createBooking);
router.get("/my", getMyBookings);
router.get("/:id", getBookingById);
router.post("/:id/cancel", cancelPendingBooking);

export default router;
