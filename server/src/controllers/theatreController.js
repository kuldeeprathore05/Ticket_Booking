import asyncHandler from "express-async-handler";
import Theatre from "../models/Theatre.js";
import { ApiError } from "../utils/ApiError.js";

export const getTheatres = asyncHandler(async (req, res) => {
  const { city } = req.query;
  const filter = {};
  if (city) filter["location.city"] = new RegExp(`^${city}$`, "i");
  const theatres = await Theatre.find(filter).populate("screens");
  res.json({ success: true, data: theatres });
});

export const getTheatreById = asyncHandler(async (req, res) => {
  const theatre = await Theatre.findById(req.params.id).populate("screens");
  if (!theatre) throw new ApiError(404, "Theatre not found");
  res.json({ success: true, data: theatre });
});
