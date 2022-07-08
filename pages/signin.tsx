import {
  ExclamationCircleIcon,
  KeyIcon,
  LockClosedIcon,
  LoginIcon,
  MailIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/outline";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MyLink from "../components/MyLink";
import { IAuthUser } from "../typings";
import { userService } from "../utils/auth";
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";

export default function SigninPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const userInfo = { email, password };
    const isUser = Object.values(userInfo).every((el) => Boolean(el));
    isUser ? setDisabled(false) : setDisabled(true);
  }, [email, password]);

  useEffect(() => {
    if (userService.userValue) {
      router.push("/");
    }
  });

  async function loginUser() {
    const userInfo: IAuthUser = {
      email,
      password,
    };
    const result = await axios.post(`${baseUrl}/api/signin`, userInfo);
    const data = await result.data;
    userService.login(data);

    toast.success("Welcome Back!");
    return data;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await loginUser();
    } catch (error) {
      catchErrors(error, setError);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <main className="max-w-4xl mx-auto px-5 sm:px-8 flex flex-col justify-center pt-8 min-h-full">
        <header className="flex items-center gap-x-8 px-6 py-4 mb-4 border-2 rounded-md bg-blue-100/70 shadow-sm border-blue-600 text-blue-600">
          <KeyIcon className="h-20 w-20" />
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="text-xl">Sign In with Email & Password</p>
          </div>
        </header>
        {Boolean(error) && (
          <header className="flex items-center space-x-3 p-4 mb-4 border-2 rounded-md bg-gray-100 shadow-sm">
            <ExclamationCircleIcon className="h-10 w-10 text-red-500" />
            <h1 className="text-2xl font-semibold text-red-500">
              Oops, {error}
            </h1>
          </header>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col pb-8 mb-12">
          <div className="p-6 py-8 border-2 border-gray-400 rounded-t-md">
            <div className="flex flex-col mb-4 flex-1">
              <label className="mb-1 font-bold" htmlFor="price">
                Email
              </label>
              <div className="border-2 w-full border-gray-300 rounded-md p-2 px-3 flex">
                <MailIcon className="h-6 w-6 text-gray-400" />
                <input
                  className="w-full outline-none px-3 ml-2 text-lg"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  name="email"
                />
              </div>
            </div>

            <div className="flex flex-col mb-8">
              <label className="mb-1 font-bold" htmlFor="description">
                Password
              </label>
              <div className="border-2 w-full border-gray-300 rounded-md p-2 px-3 flex">
                <LockClosedIcon className="h-6 w-6 text-gray-400" />
                <input
                  className="w-full outline-none px-3 ml-2 text-lg"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  name="password"
                  type="password"
                />
              </div>
            </div>
            <button
              disabled={disabled || loading}
              type="submit"
              className="signUpBtn">
              <LoginIcon className="h-6 w-6 mr-2" />
              Sign In
            </button>
          </div>
          <div className="flex items-center p-6 border-2 border-t-0 border-gray-400 rounded-b-md bg-orange-50 font-semibold space-x-3 text-lg">
            <QuestionMarkCircleIcon className="h-6 w-6" />
            <h3>
              New user?{" "}
              <MyLink
                href="/get-started"
                className="text-blue-600"
                name="Get started here"
              />{" "}
              instead
            </h3>
          </div>
        </form>
      </main>
    </div>
  );
}
