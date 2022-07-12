import { DocumentDuplicateIcon } from "@heroicons/react/outline";
import { FolderOpenIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import { IOrder } from "../typings";
import OrderAccordian from "./OrderAccordian";

interface Props {
  orders: IOrder[];
}

const AccountOrders = ({ orders }: Props) => {
  const router = useRouter();

  return (
    <>
      <header className="flex items-center mt-4">
        <FolderOpenIcon className="h-9 w-9 mr-2" />
        <h1 className="text-xl sm:text-2xl font-semibold">Order History</h1>
      </header>
      {orders.length === 0 ? (
        <section className="bg-gray-400 rounded-md p-5 text-white flex flex-col items-center space-y-4">
          <header className="flex flex-col items-center">
            <DocumentDuplicateIcon className="h-20 w-20" />
            <h3 className="text-xl font-semibold">No Past Orders.</h3>
          </header>
          <div>
            <button
              className="bg-orange-500 p-2 px-4 text-white rounded-md font-semibold shadow-lg hover:brightness-95"
              onClick={() => router.push("/?page=1")}>
              View Products
            </button>
          </div>
        </section>
      ) : (
        <>
          <OrderAccordian orders={orders} />
        </>
      )}
    </>
  );
};

export default AccountOrders;
