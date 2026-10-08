import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import Show from "../models/Show.js";
import Screen from "../models/Screen.js";
import { ApiError } from "../utils/ApiError.js";
import { reserveSeats,verifyOwnership,releaseSeats } from "../services/seatLockService.js";

export const validateReserveSeats = [
  body("seats").isArray({ min: 1 }).withMessage("seats must be a non-empty array"),
  body("seats.*").isString(),
];
 
export const reserveShowSeats = asyncHandler(async (req, res) => {
  const totalStart = performance.now();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }

  const { showId } = req.params;
  const { seats } = req.body;
  const userId = req.user._id.toString();

  const showStart = performance.now();

  const show = await Show.findById(showId);

  console.log(
    "Show query:",
    (performance.now() - showStart).toFixed(2),
    "ms"
  );

  if (!show) throw new ApiError(404, "Show not found");

  const screenStart = performance.now();

  const screen = await Screen.findById(show.screenId);

  console.log(
    "Screen query:",
    (performance.now() - screenStart).toFixed(2),
    "ms"
  );

  if (!screen) throw new ApiError(404, "Screen not found");

  const validationStart = performance.now();

  const validSeatIds = new Set(screen.seatLayout.flat());

  for (const seatId of seats) {
    if (!validSeatIds.has(seatId)) {
      throw new ApiError(400, `Invalid seat id: ${seatId}`);
    }
  }

  const alreadyBooked = seats.filter((s) =>
    show.bookedSeats.includes(s)
  );

  console.log(
    "Validation:",
    (performance.now() - validationStart).toFixed(2),
    "ms"
  );

  if (alreadyBooked.length > 0) {
    return res.status(409).json({
      success: false,
      message: `Seats already booked: ${alreadyBooked.join(", ")}`,
    });
  }

  const redisStart = performance.now();

  const result = await reserveSeats(showId, seats, userId);

  console.log(
    "reserveSeats / Redis:",
    (performance.now() - redisStart).toFixed(2),
    "ms"
  );

  if (!result.success) {
    return res.status(409).json({
      success: false,
      message: "One or more seats are currently unavailable",
    });
  }

  console.log(
    "TOTAL:",
    (performance.now() - totalStart).toFixed(2),
    "ms"
  );

  res.json({
    success: true,
    expiresIn: result.expiresIn,
    seats: result.seats,
  });
});
export const releaseShowSeats = asyncHandler(async (req, res) => {
  const { showId } = req.params;
  const { seats } = req.body;
  const userId = req.user._id.toString();

  if (!Array.isArray(seats) || seats.length === 0) {
    throw new ApiError(
      400,
      "seats must be a non-empty array"
    );
  }

  const show = await Show.findById(showId);
  if (!show) {
    throw new ApiError(404, "Show not found");
  }
 
  const ownership = await verifyOwnership(
    showId,
    seats,
    userId
  );
 
  if (!ownership.valid) {
    return res.json({
      success: true,
      message: "Reservation already expired or released",
    });
  }

  await releaseSeats(showId, seats);

  res.json({
    success: true,
    message: "Seat reservation released",
  });
});