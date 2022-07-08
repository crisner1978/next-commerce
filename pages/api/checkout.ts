// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";
import Stripe from "stripe";
import Cart from "../../models/Cart";
import { DecodedToken } from "../../typings";
import calculateTotal from "../../utils/calculateTotal";
import Order from "../../models/Order";

type Data = string;

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2020-08-27",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { paymentData } = req.body;
  console.log(paymentData);
  console.log(req.body);
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
    const { cartTotal, stripeTotal } = calculateTotal(cart.products);
    // 4) Get email from payment data, see if email linked existing customer
    const prevCustomer = await stripe.customers.list({
      email: paymentData.email,
      limit: 1,
    });

    console.log("prevCustomer")
    const isExistingCustomer = prevCustomer.data.length > 0;
    // 5) If not existing customer, create them based on email
    let newCustomer;
    if (!isExistingCustomer) {
      newCustomer = await stripe.customers.create({
        email: paymentData.email,
        source: paymentData.id,
      });
    }
    const customer =
      (isExistingCustomer && prevCustomer.data[0].id) || newCustomer?.id;
    // 6) Create charge with total, send receipt email
    const charge = await stripe.charges.create(
      {
        currency: "usd",
        source: "tok_visa",
        amount: stripeTotal,
        receipt_email: paymentData.email,
        customer,
        description: `Checkout | ${paymentData.email} | ${paymentData.id}`,
      }, { 
        idempotencyKey: nanoid() 
      });
    // 7) Add order data to database
    await new Order({
      user: userId,
      email: paymentData.email,
      total: cartTotal,
      products: cart.products,
    }).save();
    // 8) Clear products
    await Cart.findOneAndUpdate(
      { _id: cart._id }, 
      { $set: { products: [] } }
      );
    // 9) Send back success (200) response
    res.status(200).send("Checkout Successful");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing charge!");
  }
}
