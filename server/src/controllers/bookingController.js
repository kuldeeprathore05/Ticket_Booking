import asyncHandler from "express-async-handler";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyOwnership, releaseSeats } from "../services/seatLockService.js";
import { generateBookingRef } from "../utils/generateBookingRef.js";
 
// creates PENDING booking when user has a valid redis reservation 
export const createBooking = asyncHandler(async (req, res) => {
  const { showId, seats } = req.body;
  const userId = req.user._id;

  if (!showId || !Array.isArray(seats) || seats.length === 0) {
    throw new ApiError(400, "showId and a non-empty seats array are required");
  }

  const show = await Show.findById(showId);
  if (!show) throw new ApiError(404, "Show not found"); 
  const amount = show.price * seats.length;
 
  const ownership = await verifyOwnership(showId, seats, userId.toString());
  if (!ownership.valid) {
    throw new ApiError(
      410,
      "Seat reservation expired. Please select the seats again."
    );
  }

  const alreadyBooked = seats.filter((s) => show.bookedSeats.includes(s));
  if (alreadyBooked.length > 0) {
    throw new ApiError(409, `Seats already booked: ${alreadyBooked.join(", ")}`);
  }

  const booking = await Booking.create({
    userId,
    showId,
    seats,
    amount,
    paymentStatus: "PENDING",
    bookingStatus: "PENDING",
    bookingReference: generateBookingRef(),
  });

  res.status(201).json({ success: true, data: booking });
});
 
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate({
      path: "showId",
      populate: [
        { path: "movieId", select: "title poster duration" },
        { path: "theatreId", select: "name location" },
      ],
    })
    .sort({ createdAt: -1 });

  res.json({ success: true, data: bookings });
});
 
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate({
    path: "showId",
    populate: [
      { path: "movieId", select: "title poster duration" },
      { path: "theatreId", select: "name location" },
      { path: "screenId", select: "name" },
    ],
  });

  if (!booking) throw new ApiError(404, "Booking not found");

  const isOwner = booking.userId.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "ADMIN") {
    throw new ApiError(403, "Not authorized to view this booking");
  }

  res.json({ success: true, data: booking });
});
 
export const cancelPendingBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");
  if (booking.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }
  if (booking.bookingStatus !== "PENDING") {
    throw new ApiError(400, "Only pending bookings can be cancelled");
  }

  booking.bookingStatus = "CANCELLED";
  await booking.save();
  await releaseSeats(booking.showId.toString(), booking.seats);

  res.json({ success: true, data: booking });
});
