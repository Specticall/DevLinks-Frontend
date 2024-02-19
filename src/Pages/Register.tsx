import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../Components/utils/Button";
import Images from "../Components/utils/Images";
import TextField from "../Components/utils/TextField";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "../utils/config";
import axios from "axios";
import { useState } from "react";
import { expandErrorMessage } from "../utils/helper";
import { useNavigate } from "react-router-dom";

type TRegisterInput = {
  email: string;
  firstName: string;
  lastName?: string;
  password: string;
  passwordConfirm: string;
};

export type TValidationErrorValue =
  | "minLength"
  | "required"
  | "samePassword"
  | "duplicateEmail";

type TValidationError = {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  firstName?: string;
};

type TAPIError = {
  status: string;
  statusCode: number;
  message: string;
  validationErrors: Record<keyof TValidationError, string>[];
};

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterInput>();

  const [APIValidationErrors, setAPIValidationErrors] = useState<
    TValidationError | undefined
  >(undefined);

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (newUser: TRegisterInput) => {
      return axios.post(`${API_URL}/api/v1/users/register`, newUser);
    },
    onSuccess: () => {
      setAPIValidationErrors(undefined);
      navigate("/register/success");
    },
    onError: (error) => {
      // Cast the error to axio's error
      if (!axios.isAxiosError<TAPIError>(error)) return;
      const errorData = error.response?.data;

      // Validation Error
      if (errorData?.message === "Validation Error") {
        // Convert array of objects into an object
        const errorObject = errorData?.validationErrors?.reduce(
          (errorObject: TValidationError, value) => {
            const [[errorKey, errorValue]] = Object.entries(value);
            errorObject[errorKey as keyof TValidationError] =
              expandErrorMessage(errorValue as TValidationErrorValue);
            return errorObject;
          },
          {}
        );

        setAPIValidationErrors(errorObject);
        return;
      }

      // Handle Duplicate value error
      if (errorData?.message.includes("Duplicate value")) {
        setAPIValidationErrors({ email: expandErrorMessage("duplicateEmail") });
        return;
      }

      // Handle unknown errors
      console.log("UNKNOWN ERROR: ", errorData);
      throw new Error("UNKOWN SIGN IN ERROR DETECTED: ");
    },
  });

  const onSubmit: SubmitHandler<TRegisterInput> = (value) => {
    mutation.mutate(value);
  };

  return (
    <main className="bg-neutral-400 min-h-screen grid place-items-center">
      <div className="w-full p-6 max-w-[30rem] sm:max-w-[35rem]">
        <div className="mb-16 tn:flex tn:justify-center">
          <Images image="logoText" />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="tn:bg-white tn:p-8 tn:shadow-xl tn:shadow-neutral-300/50 rounded-xl md:px-12 "
        >
          <h2 className="text-heading-m text-neutral-100 font-bold mb-2">
            Create account
          </h2>

          <p className="mb-8 text-neutral-200 font-medium">
            Let's get you started sharing your links!
          </p>
          <div className="grid place-items-center gap-4">
            <TextField
              placeholder="alex@email.com"
              icon="email"
              labelDisplay="Email address"
              label="email"
              register={register}
              required
              errorMessage={
                APIValidationErrors?.email || (errors.email && "Can't be empty")
              }
            />
            <TextField
              placeholder="Alexander"
              icon="user"
              labelDisplay="First Name"
              label="firstName"
              register={register}
              required
              errorMessage={
                APIValidationErrors?.firstName ||
                (errors.firstName && "Can't be empty")
              }
            />
            <TextField
              placeholder="Jones"
              icon="user"
              labelDisplay="Last Name"
              label="lastName"
              register={register}
            />
            <TextField
              placeholder="Atleast 8 characters"
              icon="lock"
              labelDisplay="Create password"
              label="password"
              type="password"
              register={register}
              required
              errorMessage={
                APIValidationErrors?.password ||
                (errors.password && "Can't be empty")
              }
            />
            <TextField
              placeholder="Atleast 8 characters"
              icon="lock"
              labelDisplay="Password Confirm"
              label="passwordConfirm"
              type="password"
              register={register}
              required
              errorMessage={
                APIValidationErrors?.passwordConfirm ||
                (errors.passwordConfirm && "Can't be empty")
              }
            />
            <p className="text-neutral-200 text-body-s justify-self-start mt-1">
              Password must contain at least 8 characters
            </p>
            <Button className="mt-2" disabled={mutation.isPending}>
              Create Account
            </Button>
            <div className="grid place-items-center mt-2">
              <p className="text-neutral-100">Already have an account?</p>
              <Button
                type="transparent"
                link="/login"
                disabled={mutation.isPending}
              >
                Login
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
