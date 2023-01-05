import {
  BadgeCheckIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/outline";
import { PencilIcon, PlusIcon } from "@heroicons/react/solid";
import { Orbit } from "@uiball/loaders";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ProductBody } from "../typings";
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";

export default function CreatePage() {
  const [name, setName] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [uploadFile, setUploadFile] = useState<string | Blob>("");
  const [imagePreview, setImagePreview] = useState("");

  const [isSuccess, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const productInfo = { name, price, info, uploadFile };
    const isProduct = Object.values(productInfo).every((el) => Boolean(el));
    isProduct ? setDisabled(false) : setDisabled(true);
  }, [name, info, price, uploadFile]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (isSuccess) {
      timeout = setTimeout(() => setSuccess(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isSuccess]);

  // function to create new Product
  async function createProduct() {
    const imageUrl = await handleImageUpload();

    const productInfo: ProductBody = {
      name,
      price: parseInt(price),
      description: info,
      image: imageUrl,
    };

    

    const result = await axios.post(`${baseUrl}/api/product`, productInfo);
    const data = await result.data;

    setSuccess(true);
    toast.success("Product Created Successfully!");

    return data;
  }

  // function to handle the image
  function handleChange(e: React.ChangeEvent<HTMLInputElement>): any {
    const { files } = e.target;
    if (files) {
      setImagePreview(window?.URL?.createObjectURL(files[0]));
      setUploadFile(files[0]);
    }
  }

  // upload to cloudinary
  async function handleImageUpload() {
    const data = new FormData();

    data.append("file", uploadFile);
    data.append("upload_preset", "my-upload");
    data.append("cloud_name", "dtram9qiy");

    const res = await axios.post(`${process.env.CLOUDINARY_URL}`, data);
    const imageUrl = await res.data.secure_url;
    return imageUrl;
  }

  // submit data to api
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setLoading(true);
      setError("");

      await createProduct();

      setName("");
      setInfo("");
      setPrice("");
      setUploadFile("");
      setImagePreview("");
    } catch (error) {
      catchErrors(error, setError);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  return (
    <div className={`${loading && "bg-gray-50 min-h-screen"}`}>
      <main className="max-w-4xl mx-auto px-5 sm:px-8 flex flex-col justify-center pt-10 min-h-full">
        <header className="flex items-center space-x-3 p-4 mb-8 border-2 rounded-md bg-gray-100 shadow-sm">
          <PlusIcon className="h-10 w-10 text-orange-500" />
          <h1 className="text-2xl font-semibold">Create New Product</h1>
        </header>
        {isSuccess && (
          <header className="flex items-center space-x-3 p-4 mb-4 border-2 rounded-md bg-gray-100 shadow-sm">
            <BadgeCheckIcon className="h-10 w-10 text-green-500" />
            <h1 className="text-xl font-semibold">Success, Product Created!</h1>
          </header>
        )}
        {Boolean(error) && (
          <header className="flex items-center space-x-3 p-4 mb-4 border-2 rounded-md bg-gray-100 shadow-sm">
            <ExclamationCircleIcon className="h-10 w-10 text-red-500" />
            <h1 className="text-2xl font-semibold">Oops, {error}</h1>
          </header>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col pb-8 mb-12">
          <div className="flex flex-wrap justify-between gap-x-4">
            <div className="flex flex-col flex-1 mb-4">
              <label className="mb-1 font-bold" htmlFor="name">
                Name
              </label>
              <input
                className="border-2 border-gray-300 rounded-md outline-none p-2 px-3"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Name"
                type="text"
                name="name"
              />
            </div>
            <div className="flex flex-col mb-4 flex-1">
              <label className="mb-1 font-bold" htmlFor="price">
                Price
              </label>
              <input
                className="border-2 border-gray-300 rounded-md outline-none p-2 px-3"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                placeholder="Price"
                type="number"
                name="price"
              />
            </div>

            <div className="flex flex-col mb-4 flex-1">
              <label className="mb-1 font-bold" htmlFor="image">
                Image
              </label>
              <input
                className="border-2 border-gray-300 rounded-md outline-none p-[6.8px] text-sm"
                onChange={handleChange}
                placeholder="Image"
                type="file"
                name="image"
              />
            </div>
            <div className="relative w-full">
              {loading && (
                <div className="absolute top-32 right-0 left-0 mx-auto max-w-max">
                  <Orbit size={60} speed={1.5} color="#000000" />
                </div>
              )}
            </div>
            {imagePreview && (
              <img
                className="mx-auto h-80 w-80"
                src={imagePreview}
                alt="upload image preview"
              />
            )}
          </div>

          <label className="mb-1 font-bold" htmlFor="description">
            Description
          </label>
          <textarea
            className="border-2 border-gray-300 outline-none rounded-md p-3 mb-5"
            onChange={(e) => setInfo(e.target.value)}
            value={info}
            placeholder="Description"
            name="description"
            rows={4}></textarea>

          <button
            disabled={disabled || loading}
            type="submit"
            className="createSubBtn">
            <PencilIcon className="h-5 w-5 mr-2" />
            Create Product
          </button>
        </form>
      </main>
    </div>
  );
}
