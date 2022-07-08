import { Elements } from "@stripe/react-stripe-js";
import {
  Appearance,
  loadStripe, StripeElementsOptions
} from "@stripe/stripe-js";
import axios from "axios";
import Cookies from "js-cookie";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../atoms/userAtom";
import CartProductList from "../components/CartProductList";
import CartSummary from "../components/CartSummary";
import { CartProduct } from "../typings";
import baseUrl from "../utils/baseUrl";

interface Props {
  products: CartProduct[];
}
const stripePromise = loadStripe(
  `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
);

export default function CartPage({ products }: Props) {
  const user = useRecoilValue(userState);
  const [cartProducts, setCartProducts] = useState<CartProduct[]>(products);
  const [clientSecret, setClientSecret] = useState();
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const url = `${baseUrl}/api/create-payment-intent`;
    const token = Cookies.get("token");
    if (token) {
      const payload = { products };
      const headers = {
        headers: { Authorization: token, "Content-Type": "application/json" },
      };
      const createPaymentIntent = async () => {
        const response = await axios.post(url, payload, headers);
        const data = await response.data;
        setClientSecret(data.clientSecret);
      };
      createPaymentIntent();
    }
  }, []);

  const handleDelete = async (productId: any) => {
    const url = `${baseUrl}/api/cart`;
    const token = Cookies.get("token");
    if (token) {
      const payload = {
        params: { productId },
        headers: { Authorization: token },
      };
      const response = await axios.delete(url, payload);
      setCartProducts(response.data);
    }
  };

  const appearance: Appearance = {
    theme: "stripe",
  };
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      <main className="px-5 sm:px-8 pb-12">
        {/* Cart item List */}
        <div className="border-2 p-4 mt-10 pb-5 max-w-4xl mx-auto shadow-md rounded-md">
          <CartProductList
            onClick={handleDelete}
            products={cartProducts}
            success={success}
            message={message}
          />

          {!user && <hr className="border-gray-300 mx-1 my-5" />}
          {/* Cart item summary */}
          {clientSecret && (
            <Elements
              options={options}
              stripe={stripePromise}
              key={clientSecret}>
              <CartSummary
                setSuccess={setSuccess}
                setMessage={setMessage}
                success={success}
                products={cartProducts}
              />
            </Elements>
          )}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token } = req.cookies;

  if (!token) {
    return { props: { products: [] } };
  } else {
    const payload = { headers: { Authorization: token } };
    const url = `${baseUrl}/api/cart`;
    const response = await axios.get(url, payload);

    return {
      props: {
        products: response.data,
      },
    };
  }
};
