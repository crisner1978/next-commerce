import { NextApiRequest, NextApiResponse } from "next";
import Product from "../../models/Product";
import { ProductBody } from "../../typings";
import dbConnect from "../../utils/dbConnect";

dbConnect();

type Data = ProductBody | string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  switch (method) {
    case "GET":
      return getProductById(req, res);
    case "DELETE":
      return deleteProductById(req, res);
    case "POST":
      return createNewProduct(req, res);
    default:
      res.status(405).send(`Method ${method} not allowed!`);
  }
}

// get single product
async function getProductById(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { _id } = req.query;
  console.log(req.query);
  const product = await Product.findOne({ _id });
  res.status(200).json(product);
}

// delete single product
async function deleteProductById(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { productId } = req.query;

  await Product.findOneAndDelete({ productId });
  res.status(200).send("Product deleted successfully!");
}

// create single product
async function createNewProduct(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data: ProductBody = req.body;

  try {
    if (!data.description || !data.name || !data.price || !data.image) {
      return res.status(422).send("Product missing one or more fields!");
    }

    const result = await new Product(data).save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send("Server error in creating product!")
  }
}
