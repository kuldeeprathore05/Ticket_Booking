import asyncHandler from "express-async-handler";
import Show from "../models/Show.js";
import Screen from "../models/Screen.js";
import { ApiError } from "../utils/ApiError.js";
import { getLockedSeats } from "../services/seatLockService.js";

export const getShowById = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.id)
    .populate("movieId")
    .populate("theatreId", "name location")
    .populate("screenId");
  if (!show) throw new ApiError(404, "Show not found");
  res.json({ success: true, data: show });
});
 
export const getShowSeats = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.showId);
  if (!show) throw new ApiError(404, "Show not found");

  const screen = await Screen.findById(show.screenId);
  if (!screen) throw new ApiError(404, "Screen not found");

  const allSeatIds = screen.seatLayout.flat();
  const bookedSet = new Set(show.bookedSeats);
 
  const candidateSeats = allSeatIds.filter((id) => !bookedSet.has(id));
  const lockedSeats = new Set(await getLockedSeats(show._id.toString(), candidateSeats));

  const layout = screen.seatLayout.map((row) =>
    row.map((seatId) => {
      let state = "AVAILABLE";
      if (bookedSet.has(seatId)) state = "BOOKED";
      else if (lockedSeats.has(seatId)) state = "LOCKED";
      return { seatId, state };
    })
  );

  res.json({
    success: true,
    data: {
      showId: show._id,
      price: show.price,
      layout,
    },
  });
});
