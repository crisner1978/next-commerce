import { PlusIcon } from "@heroicons/react/outline";
import React from "react";

interface Props {
  productId: string;
}

const AddProduct = ({ productId }: Props) => {
  return (
    <div className="flex w-fit rounded-md">
      <input
        className="border-2 border-gray-300 rounded-l-md pl-4 outline-none w-32"
        type="number"
        placeholder="Quantity"
        name="add-product"
        id="add-product"
        min={1}
      />
      <button className="flex items-center p-2 bg-orange-600 text-white pl-3 pr-4 rounded-r-md">
        <PlusIcon className="h-5 w-5 mr-2" /> Add to Cart
      </button>
    </div>
  );
};

export default AddProduct;
