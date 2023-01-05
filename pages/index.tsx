import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Suspense } from "react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import ProductPagination from "../components/ProductPagination";
import { IProduct } from "../typings";
import baseUrl from "../utils/baseUrl";

interface Props {
  products: IProduct[];
  totalPages: number;
}

const Home = ({ products, totalPages }: Props) => {
  return (
    <div className="">
      <Head>
        <title>Furniture Barn Home</title>
        <link rel="icon" href="/favicon/favicon.ico" />
      </Head>
      <Suspense fallback={"Loading..."}>
        <Hero />
      </Suspense>

      <main className="max-w-7xl mx-auto px-8 sm:px-10">
        <section className="pt-6 pb-12">
          <h2 className="text-4xl font-semibold pb-8">Furniture Barn Home</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
        <ProductPagination siblingCount={1} totalPages={totalPages} />
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const page = query?.page ? query.page : "page=1";
  const size = 4;

  const url = `${baseUrl}/api/products`;
  const payload = { params: { page, size } };
  
  const response = await axios.get(url, payload);

  return { props: response.data };
};
