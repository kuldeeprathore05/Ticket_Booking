import api from "./api.js";

export const fetchMovies = (params = {}) => api.get("/movies", { params }).then((r) => r.data);
export const fetchMovieById = (id) => api.get(`/movies/${id}`).then((r) => r.data);
export const fetchShowsForMovie = (id, params = {}) =>
  api.get(`/movies/${id}/shows`, { params }).then((r) => r.data);
