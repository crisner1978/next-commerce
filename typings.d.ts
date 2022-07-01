import { ObjectId } from "mongoose";

export interface IProduct extends ProductBody {
  _id: string;
}

export type ProductBody = {
  name: string;
  price: number;
  description: string;
  sku?: string;
  image: string;
  message?: string;
};

export interface IUser extends UserBody {
  _id: string;
}

export type UserBody = {
  name: string;
  email: string;
  password: string;
  role?: string;
  token?: string;
}

export interface IAuthUser {
  email: string;
  password: string;
}

export type DecodedToken = {
  userId: string
}

export interface ICart extends CartBody {
  _id: string
}

export type CartBody = {
  user: ObjectId;
  products: CartProduct[]
}

type CartProduct = {
  quantity: number;
  product: ObjectId | string;
}