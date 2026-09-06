import api from "./api.js";

export const fetchShowById = (id) => api.get(`/shows/${id}`).then((r) => r.data);
export const fetchShowSeats = (showId) => api.get(`/shows/${showId}/seats`).then((r) => r.data);
export const reserveSeats = (showId, seats) =>
  api.post(`/shows/${showId}/reserve-seats`, { seats }).then((r) => r.data);
