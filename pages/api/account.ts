// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import dbConnect from "../../utils/dbConnect";
import { DecodedToken } from "../../typings";

dbConnect();

type Data = string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token!");
  }

  try {
    const token = `${req.headers.authorization}`;
    const secret = `${process.env.JWT_SECRET}`

    const { userId } = jwt.verify(token, secret) as DecodedToken;

    console.log(userId);

    const user = await User.findOne({ _id: userId });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found!");
    }
  } catch (error) {
    console.log(error);
    res.status(403).send("Invalid token");
  }
}
