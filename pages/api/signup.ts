// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import User from "../../models/User";
import Cart from "../../models/Cart";
import { UserBody } from "../../typings";
import dbConnect from "../../utils/dbConnect";

dbConnect();

type Data = UserBody | string | object;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data: UserBody = req.body;
  try {
    // 1) Validate name / email / password
    if (!isLength(data.name, { min: 3, max: 20 })) {
      return res.status(422).send("Name must be 3-20 characters long");
    } else if (!isLength(data.password, { min: 6 })) {
      return res
        .status(422)
        .send("Password must be at least 6 characters long");
    } else if (!isEmail(data.email)) {
      return res.status(422).send("Email must be valid");
    }
    // 2) Check to see if user already exists in the db
    const user = await User.findOne({ email: data.email });
    if (user) {
      return res
        .status(422)
        .send(`User already exists with email ${data.email}`);
    }
    // 3) --if not, hash their password
    const hash = await bcrypt.hash(data.password, 10);

    // 4) create user
    const newUser = await new User({
      name: data.name,
      email: data.email,
      password: hash,
    }).save();
    console.log("newUser", newUser)
    // 5) create cart for new user
    await new Cart({ user: newUser._id }).save()

    // 6) create token for the new user
    const token = jwt.sign(
      { userId: newUser._id },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: "7d",
      }
    );
    res.status(201).json({token, name: newUser.name, email: newUser.email});
    // 7) send back the token
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up, please try again later.");
  }
}
