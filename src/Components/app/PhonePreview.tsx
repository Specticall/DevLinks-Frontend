import { useLinkForm } from "../../Context/LinkFormContext";
import Images from "../utils/Images";
import LinkCard from "./LinkCard";
import { TUserResponse } from "../../Pages/AppLayout";

type Props = {
  linkFieldArrayFromServer: TUserResponse["linkList"];
};

export default function PhonePreview({ linkFieldArrayFromServer }: Props) {
  const { linkFieldArray } = useLinkForm();
  const linkList = linkFieldArray || linkFieldArrayFromServer;
  return (
    <div className="hidden lg:block rounded-xl relative">
      <ul
        className="absolute z-10 left-[50%] top-[20.5rem] translate-x-[-50%] w-[13.5rem] max-h-[17rem] overflow-auto scroll"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="grid gap-3 w-full">
          {linkList?.map((list, i) => (
            <LinkCard
              index={i}
              {...list}
              key={`Phone-Preview-${list?._id}`}
              className="[&]:py-2 text-[1rem] w-full"
            />
          ))}
        </div>
      </ul>
      <div className="bg-white px-12 py-12 rounded-lg [&>*]:scale-90 [&>*]:relative [&>*]:top-0">
        <Images image="preview" />
      </div>
    </div>
  );
}
