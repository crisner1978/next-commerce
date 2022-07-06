import { ShoppingCartIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import { CartProduct } from "../typings";
import calculateTotal from "../utils/calculateTotal";

interface Props {
  products: CartProduct[];
}

const CartSummary = ({ products }: Props) => {
  const [isEmpty, setEmpty] = useState<boolean>(false);
  const [cartAmt, setCartAmt] = useState<string>("")
  const [stripeAmt, setStripeAmt] = useState<number>(0);

  useEffect(() => {
    const { cartTotal, stripeTotal } = calculateTotal(products)
    setCartAmt(cartTotal)
    setStripeAmt(stripeTotal)
    setEmpty(products.length === 0);
  }, [products]);

  return (
    <section className="border-2 rounded-md flex justify-between">
      <div className="p-5">
        <h3 className="font-semibold text-lg">
          Sub total: <span>${cartAmt}</span>
        </h3>
      </div>
      <div className="flex flex-col justify-center p-5">
        <button
          disabled={isEmpty}
          className="checkoutBtn">
          <ShoppingCartIcon className="h-5 w-5" />
          Checkout
        </button>
      </div>
    </section>
  );
};

export default CartSummary;
