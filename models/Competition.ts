import mongoose from "mongoose";

const CompetitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this competition."],
      maxlength: [60, "Name cannot be more than 60 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    image: {
      type: String, // Will store a Base64 string
    },
  },
  { timestamps: true }
);

export default mongoose.models.Competition ||
  mongoose.model("Competition", CompetitionSchema);
