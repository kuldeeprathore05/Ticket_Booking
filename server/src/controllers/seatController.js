import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import Show from "../models/Show.js";
import Screen from "../models/Screen.js";
import { ApiError } from "../utils/ApiError.js";
import { reserveSeats } from "../services/seatLockService.js";

export const validateReserveSeats = [
  body("seats").isArray({ min: 1 }).withMessage("seats must be a non-empty array"),
  body("seats.*").isString(),
];
 
export const reserveShowSeats = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }

  const { showId } = req.params;
  const { seats } = req.body;
  const userId = req.user._id.toString();

  const show = await Show.findById(showId);
  if (!show) throw new ApiError(404, "Show not found");

  const screen = await Screen.findById(show.screenId);
  if (!screen) throw new ApiError(404, "Screen not found");

  const validSeatIds = new Set(screen.seatLayout.flat());
  for (const seatId of seats) {
    if (!validSeatIds.has(seatId)) {
      throw new ApiError(400, `Invalid seat id: ${seatId}`);
    }
  }
 
  const alreadyBooked = seats.filter((s) => show.bookedSeats.includes(s));
  if (alreadyBooked.length > 0) {
    return res.status(409).json({
      success: false,
      message: `Seats already booked: ${alreadyBooked.join(", ")}`,
    });
  }

  const result = await reserveSeats(showId, seats, userId);

  if (!result.success) {
    return res.status(409).json({
      success: false,
      message: "One or more seats are currently unavailable",
    });
  }

  res.json({ success: true, expiresIn: result.expiresIn, seats: result.seats });
});
