import mongoose, { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    type: {
      type: String,
      enum: ["INCOME", "EXPENSE"],
      required: [true, "Type is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    note: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction =
  models.Transaction || model("Transaction", TransactionSchema);

export default Transaction;
