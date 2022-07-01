import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { IProduct } from "../typings";

const { String, Number } = mongoose.Schema.Types

const ProductSchema = new mongoose.Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  sku: { type: String, unique: true, default: nanoid(10) },
  description: { type: String, required: true },
  image: { type: String, reuqired: true },
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
