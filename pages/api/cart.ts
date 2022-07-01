// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import dbConnect from "../../utils/dbConnect";
import { DecodedToken } from "../../typings";

type Data = string;

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
  }
}

async function addToCart(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { quantity, product: productId } = req.body;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token!");
  }
  try {
    // const token = `${req.headers.authorization}`;
    // const secret = `${process.env.JWT_SECRET}`;

    const { userId } = jwt.verify(
      `${req.headers.authorization}`,
      `${process.env.JWT_SECRET}`
    ) as DecodedToken;
    
  } catch (error) {
    console.error(error);
    res.status(403).send("Please sign in again");
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
