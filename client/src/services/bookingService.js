import api from "./api.js";

export const createBooking = (showId, seats) =>
  api.post("/bookings", { showId, seats }).then((r) => r.data);
export const fetchMyBookings = () => api.get("/bookings/my").then((r) => r.data);
export const fetchBookingById = (id) => api.get(`/bookings/${id}`).then((r) => r.data);
export const cancelBooking = (id) => api.post(`/bookings/${id}/cancel`).then((r) => r.data);
