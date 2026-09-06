import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true, index: true },
    },
    screens: [{ type: mongoose.Schema.Types.ObjectId, ref: "Screen" }],
  },
  { timestamps: true }
);

export default mongoose.model("Theatre", theatreSchema);
