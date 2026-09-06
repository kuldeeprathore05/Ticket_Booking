import asyncHandler from "express-async-handler";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { ApiError } from "../utils/ApiError.js";
 
export const getMovies = asyncHandler(async (req, res) => {
  const { search, genre, language, status, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (search) filter.$text = { $search: search };
  if (genre) filter.genre = genre;
  if (language) filter.language = language;
  if (status) filter.status = status;

  const movies = await Movie.find(filter)
    .sort({ releaseDate: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Movie.countDocuments(filter);

  res.json({ success: true, data: movies, total, page: Number(page) });
}); 

export const getMovieById = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) throw new ApiError(404, "Movie not found");
  res.json({ success: true, data: movie });
});
 
export const getShowsForMovie = asyncHandler(async (req, res) => {
  const { date, city } = req.query;
  const filter = { movieId: req.params.id };
  if (date) filter.date = date;

  let shows = await Show.find(filter)
    .populate("theatreId", "name location")
    .populate("screenId", "name")
    .sort({ startTime: 1 });

  if (city) {
    shows = shows.filter(
      (s) => s.theatreId?.location?.city?.toLowerCase() === city.toLowerCase()
    );
  }
 
  const grouped = {};
  for (const show of shows) {
    const theatreId = show.theatreId?._id?.toString();
    if (!theatreId) continue;
    if (!grouped[theatreId]) {
      grouped[theatreId] = { theatre: show.theatreId, shows: [] };
    }
    grouped[theatreId].shows.push({
      _id: show._id,
      screen: show.screenId,
      date: show.date,
      startTime: show.startTime,
      endTime: show.endTime,
      price: show.price,
    });
  }

  res.json({ success: true, data: Object.values(grouped) });
});
