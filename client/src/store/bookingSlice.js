import { createSlice } from "@reduxjs/toolkit";

// Holds the in-progress booking as the user moves through
// seat selection -> checkout -> payment -> confirmation.
const initialState = {
  showId: null,
  movie: null,
  theatre: null,
  show: null,
  selectedSeats: [],
  reservationExpiresAt: null, // epoch ms, set once the backend confirms the lock
  bookingId: null,
  bookingReference: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    startBooking(state, action) {
      const { movie, theatre, show } = action.payload;
      state.movie = movie;
      state.theatre = theatre;
      state.show = show;
      state.showId = show._id;
      state.selectedSeats = [];
      state.reservationExpiresAt = null;
      state.bookingId = null;
      state.bookingReference = null;
    },
    toggleSeat(state, action) {
      const seatId = action.payload;
      if (state.selectedSeats.includes(seatId)) {
        state.selectedSeats = state.selectedSeats.filter((s) => s !== seatId);
      } else {
        state.selectedSeats.push(seatId);
      }
    },
    setReservation(state, action) {
      const { expiresIn } = action.payload;
      state.reservationExpiresAt = Date.now() + expiresIn * 1000;
    },
    setBooking(state, action) {
      const { bookingId, bookingReference } = action.payload;
      state.bookingId = bookingId;
      state.bookingReference = bookingReference;
    },
    resetBooking() {
      return initialState;
    },
  },
});

export const { startBooking, toggleSeat, setReservation, setBooking, resetBooking } =
  bookingSlice.actions;
export default bookingSlice.reducer;
