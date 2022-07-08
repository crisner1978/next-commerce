// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import Cart from "../../models/Cart";
import Order from "../../models/Order";
import { DecodedToken } from "../../typings";
import calculateTotal from "../../utils/calculateTotal";

type Data = string;

// const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
//   apiVersion: "2020-08-27",
// });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { user } = req.body;

  try {
    // 1) Verify and get userId from token
    const token = `${req.headers.authorization}`;
    const secret = `${process.env.JWT_SECRET}`;
    const { userId } = jwt.verify(token, secret) as DecodedToken;

    // 2) Find cart based on userId, populate it
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product",
    });

    // 3) Calculate cart totals again from cart products
    const { cartTotal } = calculateTotal(cart.products);

    // 4) Add order data to database
    await new Order({
      user: userId,
      email: user.email,
      total: cartTotal,
      products: cart.products,
    }).save();

    // 5) Clear products
    await Cart.findOneAndUpdate(
      { _id: cart._id }, 
      { $set: { products: [] } }
      );
    // 6) Send back success (200) response
    res.status(200).send("Checkout Successful");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing charge!");
  }
}
