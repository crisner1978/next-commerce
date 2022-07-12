import { Disclosure, Transition } from "@headlessui/react";
import { MailIcon } from "@heroicons/react/outline";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { IOrder } from "../typings";
import formatDate from "../utils/formatDate";

interface Props {
  orders: IOrder[];
}

const OrderAccordian = ({ orders }: Props) => {

  return (
    <div className="w-full pt-2">
      <div className="mx-auto w-full rounded-md bg-teal-400/80 p-2 sm:px-5 shadow-md">
        {orders?.map((order, i) => (
          <Disclosure key={i} as="div" className="mb-4">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-fit rounded-lg bg-blue-600 px-4 py-2 mt-4 text-left text-sm text-white font-semibold focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                  <span>{formatDate(order.createdAt)}</span>
                  <ChevronUpIcon
                    className={`${
                      open
                        ? "rotate-180 transition-all transform duration-200 ease-out"
                        : ""
                    } h-5 w-5`}
                  />
                </Disclosure.Button>
                <Transition className="translate-y-"
                  show={open}
                  enter="transition duration-300 ease-out "
                  enterFrom="transform scale-95 opacity-0 translate-x-10"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-300 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0 translate-x-10">
                  <Disclosure.Panel unmount={false} className="p-2 sm:p-4 mt-2 mb-4 bg-gray-50 rounded-md text-gray-700 shadow-lg">
                    <div className="flex items-center gap-x-2 sm:gap-x-4">
                      <h3 className="font-bold text-sm sm:text-lg">
                        Total: ${order.total}
                      </h3>
                      <span className="font-bold text-sm sm:text-base flex items-center gap-x-1 border-2 border-gray-300 rounded-md w-fit px-2 sm:px-3 py-1">
                        <MailIcon className="h-6 w-6" /> {order.email}
                      </span>
                    </div>
                    <ul>
                      {order.products.map((p) => (
                        <li
                          key={p.product._id}
                          className="flex items-center space-x-2 sm:space-x-5 pt-4">
                          <img
                            className="w-16 h-16 rounded-md"
                            src={p.product.image}
                            alt="product"
                          />
                          <div className="text-sm truncate font-semibold w-full">
                            <h4 className="truncate">{p.product.name}</h4>
                            <p>
                              {p.quantity} • ${p.product.price}
                            </p>
                          </div>
                          <p className="flex justify-end w-fit">
                            <label className="bg-red-500 text-white text-xs py-1 px-2 whitespace-nowrap">
                              {p.product.sku}
                            </label>
                          </p>
                        </li>
                      ))}
                    </ul>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
};

export default OrderAccordian;
