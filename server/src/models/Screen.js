import mongoose from "mongoose";

// seatLayout is stored as an array of rows, each row an array of seat ids.
// Example: [["A1","A2","A3"],["B1","B2","B3"]]
const screenSchema = new mongoose.Schema(
  {
    theatreId: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre", required: true },
    name: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    seatLayout: { type: [[String]], required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Screen", screenSchema);
