import Link from "next/link";
import { IProduct } from "../typings";

interface Props {
  product: IProduct;
}

const ProductCard = ({ product }: Props) => {
  return (
    <Link href={`/product/${product._id}`}>
      <div className="group cursor-pointer overflow-hidden rounded-lg border shadow-md">
        <img
          className="transition transform duration-200 ease-in-out group-hover:scale-105"
          src={product.mediaUrl}
          alt={product.name}
        />
        <div className="bg-white group-hover:bg-gray-50 p-4 space-y-4 flex flex-col justify-evenly">
          <h3 className="text-xl font-bold truncate">{product.name}</h3>
          <div className="flex whitespace-nowrap items-end">
            <p className="truncate">{product.description}</p>
            <p className="font-semibold text-xl text-right">
              Price ${product.price}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
