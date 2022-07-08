// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import Cors from 'micro-cors';

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
})

const webhookSecret = process.env.WEBHOOK_SECRET
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2020-08-27' })

export const config = {
  api: { bodyParser: false },
};

type Data = string | null

async function webhookHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  
  
  if (req.method === "POST") {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']

    console.log(req.body)
    let event;

    try {
      if (!sig || !webhookSecret) return;

      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret)
    } catch (error: any) {
      console.log(`Webhook error: ${error.message}`)
      return res.status(400).send(`Webhook error: ${error.message}`)
    }
    console.log("Event Success", event)
    res.status(200).send('')
  }
}

export default cors(webhookHandler as any)
