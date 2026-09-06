import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    showId: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    seats: [{ type: String, required: true }],
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    bookingStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING",
    },
    bookingReference: { type: String, required: true, unique: true },
    paymentOrderId: { type: String },
    paymentId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
