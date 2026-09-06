import { Router } from "express";
import { getMovies, getMovieById, getShowsForMovie } from "../controllers/movieController.js";

const router = Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.get("/:id/shows", getShowsForMovie);

export default router;
