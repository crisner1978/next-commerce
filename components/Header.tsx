import Link from "next/link";
import React from "react";
import { ShoppingCartIcon, ViewGridAddIcon } from "@heroicons/react/outline";
import { useRouter } from 'next/router'

const Header = () => {
  const router = useRouter();
  const user = false;

  function isActive(route: string) {
    return route === router.pathname;
  }

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-5 md:px-10 lg:px-20 py-3 shadow-sm border-b bg-white">
      <nav className="flex justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-2 md:space-x-5">
          <Link href="/">
            <div className="flex items-center">
              <img
                className="w-14 object-contain cursor-pointer"
                src="https://res.cloudinary.com/dtram9qiy/image/upload/v1656108050/my-upload/aesl0cjta4x3zxymqtxo.png"
                alt="Next Commerce Logo"
              />
              <h1
                className="hidden sm:inline cursor-pointer text-2xl mt-1 font-semibold"
              >Furniture Barn</h1>
            </div>
          </Link>
          <Link href="/cart">
            <span
              className={`${
                isActive("/cart") && "text-blue-500"
              } flex items-center mt-2 cursor-pointer gap-1 group`}>
              <ShoppingCartIcon
                className={`${isActive("/cart") && "text-blue-500"} navIcon`}
              />
              <h3 className="navLink">Cart</h3>
            </span>
          </Link>
          {user && (
            <Link href="/create">
              <span
                className={`${
                  isActive("/create") && "text-blue-500"
                } flex items-center mt-2 cursor-pointer gap-1 group`}>
                <ViewGridAddIcon
                  className={`${
                    isActive("/create") && "text-blue-500"
                  } navIcon`}
                />
                <h3 className="navLink">Create</h3>
              </span>
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {user ? (
            <h3 className="mt-2 hover:text-blue-500 font-medium transition-colors duration-150 ease-out cursor-pointer">
              Sign Out
            </h3>
          ) : (
            <Link href="/signin">
              <h3
                className={`${
                  isActive("/signin") && "text-blue-500"
                } mt-2 hover:text-blue-500 font-medium transition-colors duration-150 ease-out cursor-pointer`}>
                Sign In
              </h3>
            </Link>
          )}

          <h3
            onClick={() =>
              user ? router.push("account") : router.push("/get-started")
            }
            className={`${
              user
                ? isActive("/account") && "navAcctActive"
                : isActive("/get-started") && "navAcctActive"
            } navAcct`}>
            {user ? "Account" : "Get Started"}
          </h3>
        </div>
      </nav>
    </header>
  );
};

export default Header;