import axios from "axios";
import { GetStaticProps } from "next";
import Head from "next/head";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { IProduct } from "../typings";
import { userService } from "../utils/auth";
// import { userService } from "../utils/auth";
import baseUrl from "../utils/baseUrl"

interface Props {
  products: IProduct[]
}

const Home = ({ products }: Props) => {
console.log(userService.userValue)
  return (
    <div className="">
      <Head>
        <title>Furniture Barn Home</title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>

      <Hero />
      <main className="max-w-7xl mx-auto px-8 sm:px-10">
        <section className="pt-6 pb-12">
          <h2 className="text-4xl font-semibold pb-8">Furniture Barn Home</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;


export const getStaticProps: GetStaticProps = async () => {
  const response = await axios.get(`${baseUrl}/api/products`);

  return {
    props: {
      products: response.data
    },
    revalidate: 60,
  }
}

