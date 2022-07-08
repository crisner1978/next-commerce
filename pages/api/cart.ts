// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ObjectId as OID, ObjectIdLike } from "bson";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import Cart from "../../models/Cart";
import { CartProduct, DecodedToken } from "../../typings";
import dbConnect from "../../utils/dbConnect";

dbConnect();
type Data = string;

const { ObjectId } = mongoose.Types;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  switch (method) {
    case "GET":
      return getCart(req, res);
    case "PUT":
      return addToCart(req, res);
    case "DELETE":
      return deleteItemFromCart(req, res);
    default:
      return res.status(405).send(`Method ${req.method} not allowed!`);
  }
}

async function getCart(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }
  try {
    const token = `${req.headers.authorization}`;
    const secret = `${process.env.JWT_SECRET}`;



    const { userId } = jwt.verify(token, secret) as DecodedToken;
    
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product",
    });
    
    res.status(200).json(cart.products);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please sign in again");
  }
}

async function addToCart(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { quantity, product: productId } = req.body;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token!");
  }
  try {
    const token = `${req.headers.authorization}`;
    const secret = `${process.env.JWT_SECRET}`;

    const { userId } = jwt.verify(token, secret) as DecodedToken;

    // Get user cart based on userId
    const cart = await Cart.findOne({ user: userId });
    // const objProductId =
    // Check if product already exists
    const productExists = cart.products.some(
      (doc: { product: string | OID | ObjectIdLike }) =>
        new ObjectId(productId).equals(doc.product)
    );
    // if so, increment quantity by user request
    if (productExists) {
      await Cart.findOneAndUpdate(
        { _id: cart._id, "products.product": productId },
        { $inc: { "products.$.quantity": quantity } }
      );
      // if not, add new product with given quantity
    } else {
      const newProduct: CartProduct = { quantity, product: productId };
      await Cart.findOneAndUpdate(
        { _id: cart._id },
        { $addToSet: { products: newProduct } }
      );
    }
    res.status(200).send("Cart updated!");
  } catch (error) {
    console.error(error);
    res.status(403).send("Please sign in again");
  }
}

async function deleteItemFromCart(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { productId } = req.query;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token!");
  }
  try {
    const token = `${req.headers.authorization}`;
    const secret = `${process.env.JWT_SECRET}`;

    const { userId } = jwt.verify(token, secret) as DecodedToken;
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate({
      path: "products.product",
      model: "Product",
    });
    res.status(200).json(cart.products);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please sign in again");
  }
}
