import { NextApiRequest, NextApiResponse } from "next";
import Product from "../../models/Product";
import { ProductBody } from "../../typings";
import dbConnect from "../../utils/dbConnect";
import Cart from "../../models/Cart";

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

// delete single product & remove from all carts
async function deleteProductById(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { productId } = req.query;
  try {
    // 1) Delete product by id
    await Product.findOneAndDelete({ productId });
    // 2) Remove product from all carts, referenced as 'product'
    await Cart.updateMany(
      { "products.product": productId },
      { $pull: { products: { product: productId } } }
    );
    res.status(200).send("Product deleted successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in deleting product");
  }
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
    res.status(500).send("Server error in creating product!");
  }
}
