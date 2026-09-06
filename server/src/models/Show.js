import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true, index: true },
    theatreId: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre", required: true, index: true },
    screenId: { type: mongoose.Schema.Types.ObjectId, ref: "Screen", required: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true },
    price: { type: Number, required: true },
    bookedSeats: [{ type: String }], // permanently booked seat ids for this show
  },
  { timestamps: true }
);

showSchema.index({ movieId: 1, date: 1 });

export default mongoose.model("Show", showSchema);
