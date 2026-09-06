import api from "./api.js";

export const createPaymentOrder = (bookingId) =>
  api.post("/payments/create", { bookingId }).then((r) => r.data);

export const verifyPayment = (payload) =>
  api.post("/payments/verify", payload).then((r) => r.data);
