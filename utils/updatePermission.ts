import axios from "axios";
import baseUrl from "./baseUrl";

export default async function updatePermission(_id: string, role: string) {
  const url = `${baseUrl}/api/account`
  // console.log("_id", row._id)
  const payload = { _id, role }
  await axios.put(url, payload)
}