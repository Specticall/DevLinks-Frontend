import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../Components/utils/Button";
import TextField from "../Components/utils/TextField";
import axios, { AxiosError } from "axios";
import { API_URL } from "../utils/config";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { usePopup } from "../Context/PopupContext";
import { useCookies } from "react-cookie";
import { ChangeEvent, useState } from "react";
import ProfileForm from "../Components/app/ProfileForm";
// import { } = from ""
type TProfileForm = {
  firstName: string;
  lastName?: string;
  email: string;
  image?: string;
};

type TErrorResponse = { status: string; statusCode: number; message: string };

type TUserResponse = {
  _id: string;
  email: string;
  firstName: string;
  lastName?: string;
  profileURL: string;
  shortURL: string;
  __v: number;
};

export default function User() {
  const { firstName, lastName, email, profileURL } =
    useOutletContext() as TUserResponse;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TProfileForm>({
    defaultValues: {
      firstName,
      lastName,
      email,
    },
  });

  // State that contains the user uploaded image that has not been submitted.
  const [tempImageURL, setTempImageURL] = useState<Blob | string>("");
  const [tempImageBlob, setTempImageBlob] = useState<Blob | undefined>();

  // eslint-disable-next-line
  const [cookies, _, removeCookies] = useCookies();
  const { showPopup } = usePopup();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (userData: FormData) => {
      return axios.patch(`${API_URL}/api/v1/users`, userData, {
        headers: {
          Authorization: `Bearer ${cookies.authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onError(error) {
      console.log(error);
      if (!(error instanceof AxiosError)) return;
      const errorData = error.response?.data as TErrorResponse;
      if (errorData.message.includes("Duplicate value")) {
        showPopup({
          message: "Email or Username already exist!",
        });
        return;
      }

      if (errorData.message.includes("Invalid File Format")) {
        showPopup({
          message: "Invalid File Format, use PNG or JPG Format!",
        });
        return;
      }

      if (errorData.message.includes("File too large")) {
        showPopup({
          message: "File too big! File size must be below 1MB",
        });
        return;
      }

      showPopup({
        message: "Whoops, something went wrong. Try again later!",
      });
    },
    onSuccess() {
      showPopup({
        message: "Your changes have been succesfully saved!",
      });
    },
  });

  const onSubmit: SubmitHandler<TProfileForm> = (value) => {
    // Create a multipart form data
    const formData = new FormData();

    if (tempImageBlob) {
      formData.append("file", tempImageBlob);
    }

    formData.append("firstName", value.firstName);
    formData.append("lastName", value.lastName || "");
    formData.append("email", value.email);

    if (typeof tempImageURL === "string") URL.revokeObjectURL(tempImageURL);

    // console.log(formData);
    mutation.mutate(formData);
  };

  const handleLogout = () => {
    //1. Remove auth token from cookiewhat is
    removeCookies("authToken", { sameSite: true });
    //2. Redirect user to home page
    navigate("/login", { replace: true });
  };

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const imageBlob = e.target.files[0];
    const imageURL = URL.createObjectURL(imageBlob);
    setTempImageBlob(imageBlob);
    setTempImageURL(imageURL);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-heading-s  font-bold mb-2">Profile Details</h1>
      <p className="text-body-m text-neutral-200 leading-normal mb-10">
        Add your details to create a personal touch to your profile
      </p>
      <div className="flex flex-col items-start justify-center w-full bg-neutral-350 self-center p-5 rounded-lg">
        <p className="text-neutral-200">Profile Picture</p>
        {/* ==== PROFILE PICTURE ==== */}

        <ProfileForm
          inputImage={tempImageURL}
          profileURL={profileURL}
          onImageChange={handlePictureChange}
          register={register}
          formLabel="image"
        />
        <p className="text-body-s text-neutral-200 leading-normal mt-6">
          Image must be below 1MB. Use PNG or JPG format.
        </p>
      </div>
      <div className="flex flex-col items-start justify-center w-full  self-center rounded-lg gap-3 mt-4">
        <TextField
          placeholder="First Name"
          label="firstName"
          labelDisplay="First Name*"
          register={register}
          required
          options={{
            pattern: {
              value: /^[a-zA-Z0-9\s]+$/,
              message: "Must use alphabet and numbers only",
            },
          }}
          icon="none"
          errorMessage={
            errors.firstName
              ? errors.firstName?.message || "Can't be empty"
              : undefined
          }
        />
        <TextField
          placeholder="Last Name"
          label="lastName"
          labelDisplay="Last Name*"
          register={register}
          icon="none"
        />
        <TextField
          placeholder="youremail@gmail.com"
          label="email"
          labelDisplay="Email"
          register={register}
          required
          icon="none"
          errorMessage={
            errors.email ? errors.email?.message || "Can't be empty" : undefined
          }
        />
        <div className="w-full pt-4 border-t-[1px] border-neutral-300">
          <Button
            type="primary"
            className="text-body-m"
            disabled={mutation.isPending}
          >
            Save
          </Button>
        </div>
      </div>
      <div className="w-full pt-4">
        <Button type="secondary-small" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </form>
  );
}
