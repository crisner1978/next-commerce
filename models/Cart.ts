import mongoose from "mongoose";
import { ICart } from "../typings";

const { ObjectId, Number } = mongoose.Schema.Types;

const CartSchema = new mongoose.Schema<ICart>({
  user: { type: ObjectId, ref: "User" },
  products: [
    {
      quantity: { type: Number, default: 1 },
      product: { type: ObjectId, ref: "Product" },
    },
  ],
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
