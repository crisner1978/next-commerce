import {
  LogoutIcon,
  ShoppingCartIcon,
  ViewGridAddIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/userAtom";
import { userService } from "../utils/auth";

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const isRoot = user && user?.role === "root";
  const isAdmin = user && user?.role === "admin";

  const isRootOrAdmin = isRoot || isAdmin;

  useEffect(() => {
    const subscription = userService.user.subscribe((x) => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

  function logout() {
    userService.logout();
    setUser(null);
  }

  function isActive(route: string) {
    return route === router.pathname;
  }

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-5 md:px-10 lg:px-20 py-3 shadow-sm border-b bg-white">
      <nav className="flex justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-2 md:space-x-5">
          <Link href="/?page=1">
            <div className="flex items-center">
              <img
                className="w-14 object-contain cursor-pointer"
                src="https://res.cloudinary.com/dtram9qiy/image/upload/v1656108050/my-upload/aesl0cjta4x3zxymqtxo.png"
                alt="Next Commerce Logo"
              />
              <h1 className="hidden sm:inline cursor-pointer text-2xl mt-1 font-semibold">
                Furniture Barn
              </h1>
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
          {isRootOrAdmin && (
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
            <span className="flex flex-1 items-center mt-2 cursor-pointer gap-1 group">
              <LogoutIcon onClick={logout} className="navIcon sm:hidden" />
              <h3
                onClick={logout}
                className="hidden sm:block hover:text-blue-500 font-medium transition-colors duration-150 ease-out cursor-pointer">
                Sign Out
              </h3>
            </span>
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
