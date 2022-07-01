import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useRouter } from "next/router";
import { Fragment } from "react";
import toast from "react-hot-toast";
import { SetterOrUpdater } from "recoil";
import baseUrl from "../utils/baseUrl";

interface Props {
  productId: string;
  isOpen: boolean;
  onClick?: SetterOrUpdater<boolean>;
}

export default function DeleteModal({ productId, isOpen, onClick }: Props) {
  const router = useRouter();

  async function handleDelete() {
    const url = `${baseUrl}/api/product`;
    await axios.delete(url, { params: { productId } });
    router.push("/");
    toast.success("Product Deleted!");
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => onClick?.(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-col items-start p-4 full ">
                  <div className="flex items-center w-full mb-4">
                    <Dialog.Title className="text-gray-900 font-semibold text-2xl">
                      Confirm Delete
                    </Dialog.Title>
                  </div>
                  <hr className="w-full pb-4" />
                  <p>Are you sure you want to delete this product?</p>
                  <div className="w-full mt-4 flex gap-x-2">
                    <button
                      onClick={() => onClick?.(false)}
                      className="hover:bg-transparent w-full bg-gray-400 hover:text-blue-700 font-semibold text-white py-2 px-4 border hover:border-blue-500 border-transparent rounded transition-all transform duration-150">
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-400 w-full hover:bg-red-600 text-white font-semibold py-2 px-4 rounded flex items-center justify-center transition-all transform duration-150">
                      <TrashIcon className="h-5 w-5 mr-2" />
                      Delete Now
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
