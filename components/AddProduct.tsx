import { IdentificationIcon, PlusIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../atoms/userAtom";
import baseUrl from "../utils/baseUrl";
import { CartProduct } from "../typings";
import Cookies from "js-cookie";

interface Props {
  productId: string;
}

const AddProduct = ({ productId: product }: Props) => {
  const [quantity, setQuantity] = useState(1);
  const user = useRecoilValue(userState);
  const router = useRouter();

  async function addProduct() {
    const token = Cookies.get("token");
    const url = `${baseUrl}/api/cart`;
    const payload: CartProduct = { quantity, product };
    
    if (token) {
      const headers = { headers: { Authorization: token } };
      await axios.put(url, payload, headers);
    }
  }

  return (
    <div className="flex w-fit rounded-md">
      <input
        className="border-2 border-gray-300 rounded-l-md pl-4 outline-none w-20"
        type="number"
        onChange={(e) => setQuantity(e.target.valueAsNumber)}
        value={quantity}
        placeholder="Quantity"
        name="add-product"
        id="add-product"
        min={1}
      />
      <button
        onClick={user ? addProduct : () => router.push("/get-started")}
        className={`${
          user ? "bg-orange-500" : "bg-blue-600"
        } flex items-center p-2  text-white pl-3 pr-4 rounded-r-md whitespace-nowrap`}>
        {user ? (
          <>
            <PlusIcon className="h-5 w-5 mr-2" /> Add to Cart
          </>
        ) : (
          <>
            <IdentificationIcon className="h-5 w-5 mr-2" /> Get Started Today
          </>
        )}
      </button>
    </div>
  );
};

export default AddProduct;
