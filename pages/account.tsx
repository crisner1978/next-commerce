import axios from "axios";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { parseCookies } from "nookies";
import { useRecoilValue } from "recoil";
import { userState } from "../atoms/userAtom";
import AccountOrders from "../components/AccountOrders";
import AccountPermissions from "../components/AccountPermissions";
import { IOrder } from "../typings";
import baseUrl from "../utils/baseUrl";
const AccountHeader = dynamic(() => import("../components/AccountHeader"));

interface Props {
  orders: IOrder[];
}
export default function AccountPage({ orders }: Props) {
  const user = useRecoilValue(userState);

  return (
    <main className="px-5 sm:px-8 pb-10">
      <div className="border-2 p-4 mt-4 pb-5 max-w-4xl mx-auto shadow-md rounded-md">
        {/* Account Header Component */}
        <AccountHeader user={user} />
        {/* Account Orders Component */}
        <AccountOrders orders={orders} />
        {/* Account Permissions Root User */}
        {user?.role === "root" && (
          <div className="w-[300px]">
            <AccountPermissions currentUserId={user._id} />
          </div>
          
        )}
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = parseCookies(ctx);

  if (!token) {
    return { props: { orders: [] } };
  } else {
    const payload = { headers: { Authorization: token } };
    const url = `${baseUrl}/api/orders`;
    const response = await axios.get(url, payload);

    return {
      props: {
        orders: response.data,
      },
    };
  }
};
