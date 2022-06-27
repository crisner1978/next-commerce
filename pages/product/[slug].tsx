import { TrashIcon } from "@heroicons/react/outline";
import { GetStaticProps } from "next";
import Image from "next/image";
import AddProduct from "../../components/AddProduct";
import Product from "../../models/Product";
import { IProduct } from "../../typings";
import dbConnect from "../../utils/dbConnect";

interface Props {
  product: IProduct;
}

const ProductPage = ({ product }: Props) => {
  console.log("product", product);

  return (
    <main className="max-w-4xl mx-auto px-5 sm:px-8">
      <div className="sm:flex pt-12 pb-8 gap-8">
        <div className="relative h-96 sm:h-80 sm:w-96 rounded-xl mb-4 sm:mb-0">
          <Image
            className="rounded-xl"
            src={product.mediaUrl}
            layout="fill"
            objectFit="cover"
            objectPosition="bottom"
            alt={product.name}
          />
        </div>
        <div className="flex flex-col justify-center space-y-4 w-fit">
          <h3 className="text-2xl font-semibold">{product.name}</h3>
          <p className="text-xl font-semibold">${product.price}</p>
          <p className="bg-gray-300/90 font-semibold w-fit px-3 py-1">
            SKU: {product.sku}
          </p>
          <AddProduct productId={product._id} />
        </div>
      </div>
      <div className="pb-12 space-y-4">
        <header>
          <h3 className="text-xl font-semibold">About this product</h3>
        </header>
        <p className="text-lg">{product.description}</p>
        <button className="flex items-center p-2 bg-red-600 text-white px-4 rounded-md">
          <TrashIcon className="h-5 w-5 mr-2" />
          Delete Product
        </button>
      </div>
    </main>
  );
};

export default ProductPage;

// export async function getServerSideProps({ query }: GetServerSidePropsContext){
// console.log("query", query)
// await dbConnect()

// const data = await Product.findOne({ _id: query._id })
// const product = JSON.parse(JSON.stringify(data))

//   return {
//     props: {
//       product
//     }
//   }
// }

export const getStaticPaths = async () => {
  await dbConnect();

  const data = await Product.find();
  const products = JSON.parse(JSON.stringify(data));
  const paths = products.map((product: IProduct) => ({
    params: {
      slug: product._id.valueOf(),
    },
  }));

  console.log("paths", paths);
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log("query", params);
  await dbConnect();

  const data = await Product.findOne({ _id: params?.slug });
  const product = JSON.parse(JSON.stringify(data));

  console.log("product", product);
  return {
    props: {
      product,
    },
  };
};
