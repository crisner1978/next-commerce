import { ShoppingBagIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { MouseEventHandler } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../atoms/userAtom";
import { CartBody, CartProduct, ICart, IProduct, ProductBody } from "../typings";
import CartProductCard from "./CartProductCard";

interface Props {
  products: CartProduct[];
  onClick?: (arg0: string | undefined) => {}
}

const CartProductList = ({ products, onClick }: Props) => {
  const user = useRecoilValue(userState);
  const router = useRouter();

  if (products.length === 0) {
    return (
      <section className="text-white max-w-4xl mx-auto bg-teal-500/80 rounded-md pb-5">
        <header className="text-center text-xl p-4">
          <ShoppingBagIcon className="w-28 h-28 mx-auto" />
          Your basket is Empty! Add some products!
        </header>
        {user ? (
          <button
            onClick={() => router.push("/")}
            className="grid mx-auto bg-orange-400 p-2 px-4 rounded-md shadow-md hover:bg-orange-500 transition-all transform duration-200 ease-out font-semibold">
            View Products
          </button>
        ) : (
          <button
            onClick={() => router.push("/signin")}
            className="grid mx-auto bg-blue-500 p-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-all transform duration-200 ease-out font-semibold">
            Sign In to add products
          </button>
        )}
      </section>
    );
  } else {
    return (
      <>
      {products.map((p: CartProduct, index) => (
        <CartProductCard onClick={onClick} key={p._id} p={p} index={index} />
      ))}
      </>
    )
  }
};

export default CartProductList;
