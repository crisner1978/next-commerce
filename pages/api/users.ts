// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import User from "../../models/User";
import { DecodedToken, IUser } from "../../typings";

type Data = string | IUser[] ;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const token = req.headers.authorization!;
    const secret = process.env.JWT_SECRET!;
    const { userId } = jwt.verify(token, secret) as DecodedToken;
    const users = await User.find({ _id: { $ne: userId } }).sort({ role: 'asc' });
    res.status(200).json(users)
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again!");
  }
}
