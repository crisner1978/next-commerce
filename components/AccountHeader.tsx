import { KeyIcon, UserCircleIcon } from "@heroicons/react/outline";
import React from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../atoms/userAtom";
import { IUser } from "../typings";
import formatDate from "../utils/formatDate";

interface Props {
  user: IUser | null;
}
const AccountHeader = ({ user }: Props) => {
  
  return (
    <section className="bg-violet-600 relative py-10 rounded-md shadow-md">
      <label className="absolute shadow-md top-6 -left-4 cursor-pointer bg-teal-400 brightness-105 text-white capitalize flex items-center w-fit px-5 py-1">
        <KeyIcon className="h-5 w-5 mr-2" />
        {user?.role}
      </label>
      <div className="absolute h-8 w-8 rotate-45 top-10 -left-2 -z-10 bg-black" />

      <header className="font-semibold flex flex-col items-center text-white pt-5">
        {user?.image ? (
          <img
            className="h-36 w-36 rounded-full"
            src={user.image}
            alt="User Avatar"
          />
        ) : (
          <UserCircleIcon className="h-28 w-28" />
        )}
        <h1 className="text-2xl sm:text-3xl font-bold">{user?.name}</h1>
        <p className="sm:text-lg">{user?.email}</p>
        <p className="text-sm sm:text-base font-normal">Joined @ {formatDate(user?.createdAt)}</p>
       </header>
    </section>
  );
};

export default AccountHeader;
