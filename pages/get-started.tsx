import {
  BadgeCheckIcon,
  ExclamationCircleIcon,
  IdentificationIcon,
  LockClosedIcon,
  MailIcon,
  PencilAltIcon,
  QuestionMarkCircleIcon,
  UserIcon
} from "@heroicons/react/outline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MyLink from "../components/MyLink";
import { UserBody } from "../typings";
import { userService } from "../utils/auth";
import baseUrl from "../utils/baseUrl";
import catchErrors from "../utils/catchErrors";

export default function GetStartedPage() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("")

  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false)
  const [isSuccess, setSuccess] = useState<boolean>(false)

  useEffect(() => {
    const userInfo = { name, email, password };
    const isUser = Object.values(userInfo).every((el) => Boolean(el));
    isUser ? setDisabled(false) : setDisabled(true);
  }, [name, email, password]);

  async function createUser() {
    const userInfo: UserBody = {
      name, email, password
    }
    const result = await axios.post(`${baseUrl}/api/signup`, userInfo);
    const data = await result.data
    userService.login(data)

    setSuccess(true);

    toast.success("User Created Successfully!");

    setTimeout(() => {
      setSuccess(false);
    }, 5000);

    return data;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      await createUser()

    } catch (error) {
      catchErrors(error, setError)
      toast.error("Something went wrong!");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <main className="max-w-4xl mx-auto px-5 sm:px-8 flex flex-col justify-center pt-8 min-h-full">
        <header className="flex items-center gap-x-8 px-6 py-4 mb-4 border-2 rounded-md bg-teal-100/70 shadow-sm border-teal-600">
          <IdentificationIcon className="h-20 w-20 text-teal-600" />
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-teal-600">Get Started!</h1>
            <p className="text-teal-600 text-xl">Create a new account</p>
          </div>
        </header>
        {isSuccess && (
          <header className="flex items-center space-x-3 p-4 mb-4 border-2 rounded-md bg-gray-100 shadow-sm">
            <BadgeCheckIcon className="h-10 w-10 text-green-500" />
            <h1 className="text-xl font-semibold">Success, User Profile Created!</h1>
          </header>
        )}
        {Boolean(error) && (
          <header className="flex items-center space-x-3 p-4 mb-4 border-2 rounded-md bg-red-100 shadow-sm">
            <ExclamationCircleIcon className="h-10 w-10 text-red-900" />
            <h1 className="text-2xl font-semibold text-red-900">Oops, {error}</h1>
          </header>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col pb-8 mb-12">
          <div className="p-6 py-8 border-2 border-gray-400 rounded-t-md">
            <div className="flex flex-col flex-1 mb-4">
              <label className="mb-1 font-bold" htmlFor="name">
                Name
              </label>
              <div className="border-2 w-full border-gray-300 rounded-md outline-none p-2 px-3 flex">
                <UserIcon className="h-6 w-6 text-gray-400" />
                <input
                  className="w-full outline-none px-3 ml-2 text-lg"
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  name="name"
                />
              </div>
            </div>
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
                  className="w-full outline-none ml-2 px-3 text-lg"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  name="password"
                  type="password"
                />
              </div>
            </div>
            <button disabled={disabled || loading} type="submit" className="signUpBtn">
              <PencilAltIcon className="h-6 w-6 mr-2" />
              Get Started
            </button>
          </div>
          <div className="flex items-center p-6 border-2 border-t-0 border-gray-400 rounded-b-md bg-orange-50 font-semibold space-x-3">
            <QuestionMarkCircleIcon className="h-6 w-6" />
            <h3>
              Existing user?{" "}
              <MyLink
                href="/signin"
                className="text-blue-600"
                name="Sign in here"
                active
              />{" "}
              instead
            </h3>
          </div>
        </form>
      </main>
    </div>
  );
}
