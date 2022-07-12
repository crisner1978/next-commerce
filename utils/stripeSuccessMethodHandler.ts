import { PaymentIntent } from "@stripe/stripe-js";
import axios from "axios";
import Cookies from "js-cookie";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { IUser } from "../typings";
import baseUrl from "./baseUrl";

export default async function stripeSuccessMethodHandler(
  paymentIntent: PaymentIntent,
  setMessage: Dispatch<SetStateAction<string>>,
  setSuccess: Dispatch<SetStateAction<boolean>>,
  user: IUser | null
) {
  let count = 0
  if (paymentIntent.status === "succeeded") {
    count++
    setSuccess(true);
    setMessage("Payment Succeeded!");
    toast.success("Thank You! Payment Successful!")
    try {
      const token = Cookies.get("token");
      if (token) {
        const headers = { headers: { Authorization: token } };
        const payload = { user };
        const url = `${baseUrl}/api/checkout`;
        await axios.post(url, payload, headers);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // console.log(count)
    }
  }
}
