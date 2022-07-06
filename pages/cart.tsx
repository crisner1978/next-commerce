import axios from "axios";
import Cookies from "js-cookie";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../atoms/userAtom";
import CartProductList from "../components/CartProductList";
import CartSummary from "../components/CartSummary";
import { CartProduct } from "../typings";
import baseUrl from "../utils/baseUrl";

interface Props {
  products: CartProduct[];
}

export default function CartPage({ products }: Props) {
  const user = useRecoilValue(userState);
  const [cartProducts, setCartProducts] = useState<CartProduct[]>(products);
  console.log("products", products);

  const handleDelete = async (productId: any) => {
    const url = `${baseUrl}/api/cart`;
    const token = Cookies.get("token");
    if (token) {
      const payload = {
        params: { productId },
        headers: { Authorization: token },
      };
      const response = await axios.delete(url, payload);
      setCartProducts(response.data)
    }
  };

  return (
    <div>
      <main className="px-5 sm:px-8 pb-12">
        {/* Cart item List */}
        <div className="border-2 p-4 mt-10 pb-5 max-w-4xl mx-auto shadow-md rounded-md">
          <CartProductList onClick={handleDelete} products={cartProducts} />

          {!user && <hr className="border-gray-300 mx-1 my-5" />}
          {/* Cart item summary */}
          <CartSummary products={cartProducts} />
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
