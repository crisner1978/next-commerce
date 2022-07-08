// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";

type Data = string | { publishableKey: NodeJS.Process | string | undefined };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }

  if (req.method === "GET") {
    res
      .status(200)
      .json({ publishableKey: process.env.NEXT_PUBLIC_STRIPE_PK });
  } else {
    res.status(405).end("Method not allowed!")
  }
}
