import { atom } from "recoil";
import { IUser } from "../typings";

export const userState = atom<IUser | null>({
  key: "userState",
  default: null,
})