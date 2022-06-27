import mongoose, { Schema, model, connect } from 'mongoose';
import { IProduct } from '../typings';
import { nanoid } from 'nanoid'

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  sku: { type: String, unique: true, default: nanoid(10) }, 
  description: { type: String, required: true },
  mediaUrl: { type: String, reuqired: true }
})

export default mongoose.models.Product || model<IProduct>("Product", ProductSchema)