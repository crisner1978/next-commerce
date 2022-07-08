import { NextApiRequest, NextApiResponse } from "next";
import { DecodedToken } from "../../typings";
import calculateTotal from "../../utils/calculateTotal";
import Stripe from "stripe";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
// This is your test secret API key.

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2020-08-27",
});

type Data = string | { clientSecret: string | null };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { products } = req.body;

  try {
    // 1) Verify and get userId from token
    const token = `${req.headers.authorization}`;
    const secret = `${process.env.JWT_SECRET}`;
    const { userId } = jwt.verify(token, secret) as DecodedToken;
    // 2) Find cart bassed on userId, populate it
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product",
    });
    

    // 3) Calculate cart totals again from cart products
    const { cartTotal, stripeTotal } = calculateTotal(cart.products);
    const paymentIntent: Stripe.Response<Stripe.PaymentIntent> =
      await stripe.paymentIntents.create({
        amount: stripeTotal,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error)
  }

  // Create a PaymentIntent with the order amount and currency
}
