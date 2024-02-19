import {
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
} from "react-router-dom";
import Navbar from "../Components/app/Navbar";
import { withCookies } from "react-cookie";
import PhonePreview from "../Components/app/PhonePreview";
import { APIResponse, cookies } from "../utils/helper";
import axios from "axios";
import { API_URL } from "../utils/config";
import { LinkFormProvider } from "../Context/LinkFormContext";
import { TLinks } from "./Link";

export type TUserResponse = {
  email: string;
  firstName: string;
  lastName: string;
  profileURL: string;
  shortURL: string;
  __v: number;
  _id: string;
  linkList: TLinks[];
};

export const loader = (async () => {
  try {
    const token = cookies.get("authToken");

    if (!token) throw new Error("No Token");

    const response = await axios.get<APIResponse<TUserResponse>>(
      `${API_URL}/api/v1/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const user = response.data.data;
    return user;
  } catch (error) {
    console.log("Token expired / invalid");
    return redirect("/login");
  }
}) satisfies LoaderFunction;

const AppLayout = withCookies(function () {
  const userData = useLoaderData() as TUserResponse;

  return (
    <LinkFormProvider>
      <div className="text-xl bg-neutral-350 min-h-screen pt-24 ">
        <Navbar />
        <main className="mx-4 pb-4 flex justify-center items-start rounded-lg min-h-full gap-8">
          <PhonePreview linkFieldArrayFromServer={userData.linkList} />
          <div className="bg-white p-6 sm:p-10 rounded-xl overflow-auto max-w-[35rem] w-full">
            <Outlet context={userData} />
          </div>
        </main>
      </div>
    </LinkFormProvider>
  );
});

export default AppLayout;
