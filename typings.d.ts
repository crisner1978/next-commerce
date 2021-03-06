import { ObjectId } from "mongoose";

export interface IProduct extends ProductBody {
  _id: string;
}

export type ProductBody = {
  _id?: string;
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
  createdAt?: string;
  updatedAt?: string;
  image?: string;
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
  _id?: string;
  quantity: number;
  product: IProduct;
}


export interface IOrder extends Order {
  _id: string
}

export type Order = {
  createdAt: string;
  updatedAt: string;
  products: CartProduct[];
  total: number;
  email: string;
  user: IUser;
}