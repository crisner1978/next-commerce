import { NextApiRequest, NextApiResponse } from "next";
import Product from "../../models/Product";
import { IProduct } from "../../typings";
import dbConnect from "../../utils/dbConnect";

dbConnect();

type Data = {
  products: IProduct[];
  totalPages: number;
} | string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const { page, size } = req.query;

    const pageNum = Number(page);
    const pageSize = Number(size);
    
    let products: IProduct[] = [];
    const totalDocs = await Product.countDocuments();
    const totalPages = Math.ceil(totalDocs / pageSize);

    if (pageNum === 1) {
      products = await Product.find().sort({ createdAt: 'asc'}).limit(pageSize);
    } else {
      const skips = pageSize * (pageNum - 1);
      products = await Product.find().skip(skips).sort({ createdAt: 'asc'}).limit(pageSize);
    }
    
    res.status(200).json({ products, totalPages });
  } else {
    res.status(405).send("Only 'GET' method allowed for this route!");
  }
}
