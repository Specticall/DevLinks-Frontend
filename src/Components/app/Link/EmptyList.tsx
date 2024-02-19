import Images from "../../utils/Images";

export default function EmptyList() {
  return (
    <>
      <div className="grid place-items-center self-center px-5 py-10 w-full max-w-[32.5rem]">
        <div className="my-12">
          <Images image="phoneWithHand" />
        </div>
        <h2 className="text-heading-s  font-semi-bold mb-2">
          Let's get you started
        </h2>
        <p className="text-body-m text-neutral-200 leading-normal my-6 text-center">
          Use the “Add new link” button to get started. Once you have more than
          one link, you can reorder and edit them. We’re here to help you share
          your profiles with everyone!
        </p>
      </div>
    </>
  );
}
