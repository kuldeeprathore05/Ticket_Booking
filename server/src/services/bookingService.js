import mongoose from "mongoose";
import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyOwnership, releaseSeats } from "./seatLockService.js";
 
export const confirmBooking = async (booking) => {
  const userId = booking.userId.toString();
  const showId = booking.showId.toString();
 
  const ownership = await verifyOwnership(showId, booking.seats, userId);
  if (!ownership.valid) {
    booking.bookingStatus = "CANCELLED";
    booking.paymentStatus = "FAILED";
    await booking.save();
    throw new ApiError(
      410,
      "Seat reservation expired. Please select the seats again."
    );
  }
 
  const updatedShow = await Show.findOneAndUpdate(
    {
      _id: showId,
      bookedSeats: { $nin: booking.seats }, // none of these seats already booked
    },
    { $addToSet: { bookedSeats: { $each: booking.seats } } },
    { new: true }
  );

  if (!updatedShow) {
    booking.bookingStatus = "CANCELLED";
    booking.paymentStatus = "FAILED";
    await booking.save();
    throw new ApiError(409, "One or more seats were already booked by another user");
  }
 
  booking.bookingStatus = "CONFIRMED";
  booking.paymentStatus = "PAID";
  await booking.save();

  await releaseSeats(showId, booking.seats);

  return booking;
};
