import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/userAtom";
import { userService } from "../utils/auth";
import baseUrl from "../utils/baseUrl";
import { toastOptions } from "../utils/toastOptions";
import Header from "./Header";

interface Props {
  children: React.ReactNode;
}

const AppProviders = ({ children }: Props) => {
  const [authorized, setAuthorized] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();

  useEffect(() => {
    function syncLogout(e: StorageEvent) {
      if (e.key === "logout") {
        router.push("/signin");
      }
    }
    if (!user) {
      window.addEventListener("storage", syncLogout);
      return () => window?.removeEventListener("storage", syncLogout);
    }
  }, []);

  useEffect(() => {
    authCheck(router.asPath);

    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    router.events.on("routeChangeComplete", authCheck);

    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, []);

  async function authCheck(url: string) {
    const protectedRoute = ["/account", "/create"];
    const token = Cookies.get("token");
    const path = url.split("?")[0];

    if (!token && protectedRoute.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: "/signin",
      });
    } else if (token) {
      try {
        const payload = { headers: { Authorization: token } };
        const url = `${baseUrl}/api/account`;
        const response = await axios.get(url, payload);
        const authUser = response.data;
        userService.checkRoleAuth(authUser, path);

        setUser(authUser);
        setAuthorized(true);
      } catch (error) {
        console.error("Error getting current user", error);
        setAuthorized(false);
        setUser(null);
        userService.logout();
      }
    } else {
      setAuthorized(true);
    }
  }

  return (
    <>
      <Header />
      {authorized && children}
      <Toaster position="bottom-right" toastOptions={toastOptions} />
    </>
  );
};

export default AppProviders;
