import { Router } from "express";
import { requireAuth, attachUser } from "../middleware/auth.js";
import { getShowById, getShowSeats } from "../controllers/showController.js";
import { reserveShowSeats, validateReserveSeats } from "../controllers/seatController.js";

const router = Router();

router.get("/:id", getShowById);
router.get("/:showId/seats", getShowSeats);
router.post(
  "/:showId/reserve-seats",
  requireAuth,
  attachUser,
  validateReserveSeats,
  reserveShowSeats
);

export default router;
