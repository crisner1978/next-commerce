import { XCircleIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { MouseEventHandler } from "react";
import { CartProduct } from "../typings";
import MyLink from "./MyLink";

type Props = {
  p: CartProduct;
  index: number;
  onClick?: (arg0: string | undefined) => {}
}

const CartProductCard = ({ p, index, onClick }: Props) => {

  return (
    <>
      <div className="sm:flex pt-12 pb-8 gap-8">
        <div className="relative min-h-[250px] min-w-[250px] mx-auto sm:mx-0 sm:h-60 sm:w-60 rounded-xl mb-4 sm:mb-0 flex-shrink-0">
          <Image
            className="rounded-xl h-96 sm:h-60 sm:w-60"
            src={p.product.image}
            layout="fill"
            objectFit="cover"
            objectPosition="bottom"
            alt={p.product.name}
            priority={true}
          />
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col justify-start space-y-4 w-fit">
            <MyLink href={`/product/${p.product._id}`} name={p.product.name} />
            <p className="text-lg font-semibold">
              {p.quantity} x ${p.product.price}
            </p>
          </div>
          <button
            onClick={() => onClick?.(p?.product?._id)}
            className="group border h-fit p-2 ml-2 rounded-lg bg-gray-100 hover:scale-110 hover:bg-white
             hover:shadow-md hover:text-red-600 transition-all transform duration-200 ease-out">
            <XCircleIcon className="h-10 w-10 text-gray-400 group-hover:text-red-600" />
          </button>
        </div>
      </div>
      {index !== undefined ? (
        <hr className="border-gray-300 mx-1 my-4 " />
      ) : null}
    </>
  );
};

export default CartProductCard;
