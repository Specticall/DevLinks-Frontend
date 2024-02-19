import axios from "axios";
import { matchPath, redirect, useLoaderData } from "react-router-dom";
import { API_URL, BASE_URL } from "../utils/config";
import { APIResponse, cookies } from "../utils/helper";
import Button from "../Components/utils/Button";
import { usePopup } from "../Context/PopupContext";
import LinkCard from "../Components/app/LinkCard";

type TLink = { platform: string; URL: string };
type TUserResponse = {
  _id?: string;
  firstName: string;
  email: string;
  lastName: string;
  linkList: TLink[];
  isAnonym?: boolean;
  profileURL: string;
};

export const loader = async () => {
  try {
    const path = matchPath(
      { path: "/preview/:name?" },
      window.location.pathname
    );

    const username = path?.params?.name?.replace(/["_"]/g, " ");

    // If username exist then fetch using username
    if (username) {
      const user = await axios.get<APIResponse<TUserResponse>>(
        `${API_URL}/api/v1/users/${username}`
      );
      return { ...user.data.data, isAnonym: true };
    }

    // If username does not exist than we fetch using the token (if available)
    const user = await axios.get<APIResponse<TUserResponse>>(
      `${API_URL}/api/v1/users/`,
      {
        headers: {
          Authorization: `Bearer ${cookies.get("authToken")}`,
        },
      }
    );
    return { ...user.data.data, isAnonym: false };
  } catch (err) {
    return redirect("/login");
  }
};

export default function Preview() {
  const userData = useLoaderData() as TUserResponse;

  const fullName = `${userData.firstName}${
    userData.lastName ? " " + userData.lastName : ""
  }`;
  return (
    <main className="relative md:px-8 md:pt-8">
      <div className="absolute top-0 right-0 left-0 bg-accent-100 h-[20rem] z-[-1] rounded-b-[2rem] hidden md:block"></div>
      {!userData.isAnonym && <Navbar name={userData.firstName} />}
      <PreviewCard
        name={fullName}
        linkList={userData.linkList}
        email={userData.email}
        profileURL={userData.profileURL}
      />
    </main>
  );
}

type TPreviewCardProps = {
  name: string;
  email: string;
  linkList: TLink[];
  profileURL: string;
};

function PreviewCard({ name, email, linkList, profileURL }: TPreviewCardProps) {
  return (
    <article className="max-w-[30rem] p-8 py-16 mx-auto w-full md:bg-white mt-20 rounded-[2rem] md:shadow-xl md:p-14">
      <div className="flex flex-col justify-center items-center">
        <div className="w-[7.5rem] h-[7.5rem] rounded-full bg-accent-300 border-[.25rem] border-accent-100 overflow-hidden">
          <img
            src={`${API_URL}/api/v1/files/${profileURL}`}
            // onError={handleBrokenImage}
            className="object-cover w-full h-full"
          ></img>
        </div>
        <h2 className="mt-6 text-heading-m text-neutral-100 font-bold text-center leading-10 mb-4">
          {name}
        </h2>
        <p className="text-body-m text-neutral-200">{email}</p>
        <LinkList linkList={linkList} />
      </div>
    </article>
  );
}

function LinkList({ linkList }: { linkList: TLink[] }) {
  return (
    <ul className="w-full grid gap-3 mt-12">
      {linkList.map((link, index) => {
        return <LinkCard {...link} index={index} />;
      })}
    </ul>
  );
}

function Navbar({ name }: { name: string }) {
  const { showPopup } = usePopup();
  const handleShareLink = () => {
    const formattedName = name.replace(/[" "]/g, "_");
    const link = `${BASE_URL}/preview/${formattedName}`;

    navigator.clipboard.writeText(link);
    showPopup({
      message: "Link copied to clipboard",
    });
  };
  return (
    <nav className="relative flex px-5 py-4 gap-4 bg-white md:justify-between md:[&>button]:w-[10rem]">
      <Button link="/app/link" type="secondary">
        Back to Editor
      </Button>
      <Button onClick={handleShareLink}>Share Link</Button>
    </nav>
  );
}
