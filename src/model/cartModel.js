import mongoose from "mongoose";

const cartschema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
    }
  },
  { timestamps: true }
);

export const cartModel = mongoose.model("cart", cartschema);
