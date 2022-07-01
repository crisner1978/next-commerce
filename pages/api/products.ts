import { NextApiRequest, NextApiResponse } from "next";
import Product from "../../models/Product";
import { IProduct } from "../../typings";
import dbConnect from "../../utils/dbConnect";

dbConnect();

type Data = IProduct[] | string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const products: IProduct[] = await Product.find()
    res.status(200).json(products);
  } else {
    res
      .status(405)
      .send("Only 'GET' method allowed for this route!");
  }
}
