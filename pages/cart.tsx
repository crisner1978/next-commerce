import { ShoppingBagIcon, ShoppingCartIcon } from "@heroicons/react/outline";
import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../atoms/userAtom";
import { CartProduct } from "../typings";
import baseUrl from "../utils/baseUrl";

interface Props {
  products: CartProduct[]
}

export default function CartPage({ products }: Props) {
  const user = useRecoilValue(userState);

  console.log("products", products)

  return (
    <div>
      <main className="px-5 sm:px-8">
        {/* Cart item List */}
        <div className="border-2 p-4 mt-10 pb-5 max-w-4xl mx-auto shadow-md rounded-md">
          <section className="text-white max-w-4xl mx-auto bg-teal-500/80 rounded-md pb-5">
            <header className="text-center text-xl p-4">
              <ShoppingBagIcon className="w-28 h-28 mx-auto" />
              Your basket is Empty! Add some products!
            </header>
            {user ? (
              <button className="grid mx-auto bg-orange-400 p-2 px-4 rounded-md shadow-md hover:bg-orange-500 transition-all transform duration-200 ease-out font-semibold">
                View Products
              </button>
            ) : (
              <button className="grid mx-auto bg-blue-500 p-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-all transform duration-200 ease-out font-semibold">
                Sign In to add products
              </button>
            )}
          </section>

          <hr className="border-gray-300 mx-1 my-5" />
          {/* Cart item summary */}
          <section className="border-2 rounded-md flex justify-between">
            <div className="p-5">
              <h3 className="font-semibold text-lg">
                Sub total: <span>$0.00</span>
              </h3>
            </div>
            <div className="flex flex-col justify-center p-5">
              <button className="flex items-center gap-x-4 text-lg font-semibold p-2 px-4 bg-teal-500/80 text-white rounded-md shadow-md">
                <ShoppingCartIcon className="h-6 w-6" />
                Checkout
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = async () => {
  const token = Cookies.get("token");
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
