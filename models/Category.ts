import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    type: {
      type: String,
      enum: ["INCOME", "EXPENSE"],
      required: [true, "Type is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Category = models.Category || model("Category", CategorySchema);

export default Category;
