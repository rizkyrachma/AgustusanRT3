import mongoose, { Schema, model, models } from "mongoose";

const CommitteeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
    },
    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Committee = models.Committee || model("Committee", CommitteeSchema);

export default Committee;
