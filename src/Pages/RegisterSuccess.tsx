import Button from "../Components/utils/Button";
import Images from "../Components/utils/Images";

export default function RegisterSuccess() {
  return (
    <main className="grid place-items-center h-screen">
      <div className="grid place-items-center p-6">
        <div className="mb-20 scale-125">
          <Images image="phoneWithHand" />
        </div>
        <h1 className="text-heading-m font-bold mb-6 px-4 text-center leading-10">
          Account Registered
        </h1>
        <p className="text-center text-neutral-200 mb-8 max-w-[25rem]">
          Congratulations on creating your Devlinks account! Click the link
          below to login to your account
        </p>
        <Button link="/login" width="15rem">
          Login
        </Button>
      </div>
    </main>
  );
}
