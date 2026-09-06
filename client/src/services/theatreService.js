import api from "./api.js";

export const fetchTheatres = (params = {}) => api.get("/theatres", { params }).then((r) => r.data);
