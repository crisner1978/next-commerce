import {
  BadgeCheckIcon,
  IdentificationIcon,
  PlusIcon,
} from "@heroicons/react/outline";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../atoms/userAtom";
import baseUrl from "../utils/baseUrl";
import { CartProduct, IProduct } from "../typings";
import Cookies from "js-cookie";
import catchErrors from "../utils/catchErrors";
import { DotSpinner } from "@uiball/loaders";
import toast from "react-hot-toast";

interface Props {
  productId: string;
}

const AddProduct = ({ productId: product }: Props) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('')
  const user = useRecoilValue(userState);
  const router = useRouter();

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (success) {
      timeout = setTimeout(() => setSuccess(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [success]);

  async function addProduct() {
    try {
      setLoading(true);
      setErrorMsg("")
      const token = Cookies.get("token");
      const url = `${baseUrl}/api/cart`;
      const payload = { quantity, product };

      if (token) {
        const headers = { headers: { Authorization: token } };
        await axios.put(url, payload, headers);
        setSuccess(true);
        toast.success("Item Added Successfully!");
      }
    } catch (error) {
      catchErrors(error, setErrorMsg);
      toast.error(errorMsg ? errorMsg : "Something went wrong!");
    } finally {
      setLoading(false);
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
        disabled={(user && success) || loading}
        onClick={user ? addProduct : () => router.push("/get-started")}
        className={`${user ? "bg-orange-500" : "bg-blue-600"} flex items-center p-2 
        px-4 text-white rounded-r-md whitespace-nowrap relative disabled:bg-blue-600`}>
        {user && success ? (
          <>
            <BadgeCheckIcon className="h-5 w-5 mr-2" /> Item Added!
          </>
        ) : user ? (
          <>
            <PlusIcon className="h-5 w-5 mr-2" /> Add to Cart
          </>
        ) : (
          <>
            <IdentificationIcon className="h-5 w-5 mr-2" /> Get Started Today
          </>
        )}
        {loading && (
          <div className="absolute left-14">
            <DotSpinner size={30} speed={0.9} color="black" />
          </div>
        )}
      </button>
    </div>
  );
};

export default AddProduct;
