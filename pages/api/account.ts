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
  const { method } = req;

  switch (method) {
    case "GET":
      return getUsers(req, res);
    case "PUT":
      return updateUser(req, res);
    default:
      return res.status(405).send(`Method ${req.method} not allowed!`);
  }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token!");
  }

  try {
    const token = `${req.headers.authorization}`;
    const secret = `${process.env.JWT_SECRET}`;

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

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  let { _id, role } = req.body;
  
  if (role === "user") {
    role = "admin"
  } else {
    role = "user"
  }
  console.log("role", role, _id)
  await User.findOneAndUpdate({ _id }, { role });

  res.status(203).send("User updated!");
}
