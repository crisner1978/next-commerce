// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import User from "../../models/User";
import { IAuthUser } from "../../typings";
import dbConnect from "../../utils/dbConnect";

dbConnect();

type Data = string | object;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data: IAuthUser = req.body;
  try {
    // 1) check for user exists
    const user = await User.findOne({ email: data.email }).select("+password");
    // 2) --if not return error
    if (!user) {
      return res.status(404).send("No user exists with that email");
    }
    // 3) check if users' password matches
    const isValid = await bcrypt.compare(data.password, user.password);
    // 4) --if so, generate a token
    if (isValid) {
      const token = jwt.sign(
        { userId: user._id },
        `${process.env.JWT_SECRET}`,
        { expiresIn: "7d" }
      );
      res.status(200).json({token, name: user.name, email: user.email});
    } else {
      res.status(401).send("Passwords do not match!");
    }
    // 5) send that token to the client
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in user!");
  }
}
