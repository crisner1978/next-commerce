// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import Order from "../../models/Order";
import { DecodedToken } from "../../typings";
import dbConnect from '../../utils/dbConnect'

dbConnect()

type Data = string | Omit<any, never>[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const token = req.headers.authorization!;
    const secret = process.env.JWT_SECRET!;
    const { userId } = jwt.verify(token, secret) as DecodedToken;

    const orders = await Order.find({ user: userId }).sort({ createdAt: 'desc' }).populate({
      path: "products.product",
      model: "Product",
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again!");
  }
}
