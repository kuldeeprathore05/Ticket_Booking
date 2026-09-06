import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    poster: { type: String, required: true },
    banner: { type: String },
    genre: [{ type: String, index: true }],
    language: { type: String, required: true, index: true },
    duration: { type: Number, required: true }, // minutes
    releaseDate: { type: Date, required: true },
    rating: { type: Number, min: 0, max: 10, default: 0 },
    cast: [{ type: String }],
    director: { type: String },
    status: {
      type: String,
      enum: ["UPCOMING", "NOW_SHOWING", "ENDED"],
      default: "NOW_SHOWING",
      index: true,
    },
  },
  { timestamps: true }
);

movieSchema.index({ title: "text", genre: "text", language: "text" },{
    language_override: "textLanguage",
  });

export default mongoose.model("Movie", movieSchema);
