import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../Components/utils/Button";
import Images from "../Components/utils/Images";
import TextField from "../Components/utils/TextField";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "../utils/config";
import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

type TLoginForm = {
  email: string;
  password: string;
};

type TLoginSuccessResponse = {
  status: string;
  token: string;
  tokenExpiredAt: number;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginForm>();

  //cookies is not used.
  const [cookies, setCookies] = useCookies(["authToken", "authTokenExpiredAt"]);

  const navigate = useNavigate();

  const [APIValidationError, setAPIValidationError] = useState<
    Record<string, string> | undefined
  >(undefined);

  const mutation = useMutation({
    mutationFn(newUser: TLoginForm) {
      return axios.post<TLoginSuccessResponse>(
        `${API_URL}/api/v1/users/login`,
        newUser
      );
    },
    onError(error) {
      if (!axios.isAxiosError(error)) return;
      const errorData = error.response?.data;
      setAPIValidationError({
        [errorData.message.includes("User does not exist")
          ? "email"
          : "password"]: errorData.message,
      });
    },
    onSuccess(data) {
      //1. Return token from backend
      const token = data.data.token;

      //2. Store in HTTP-only cookie
      setCookies("authToken", token, { sameSite: "strict" });

      //3. Navigate to main page
      navigate("/app/link");
    },
  });

  const onSubmit: SubmitHandler<TLoginForm> = (value) => {
    mutation.mutate(value);
  };

  return (
    <main className="bg-neutral-400 h-screen grid place-items-center">
      <div className="w-full py-6 tn:max-w-[30rem]">
        <div className="mb-16 px-4 tn:flex tn:justify-center">
          <Images image="logoText" />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="tn:bg-white tn:shadow-xl tn:shadow-neutral-300/50 p-6 tn:p-10 rounded-xl"
        >
          <h2 className="text-heading-m text-neutral-100 font-bold mb-2">
            Login
          </h2>
          <p className="mb-8 text-neutral-200 font-medium">
            Add your details below to get back into the app
          </p>
          <div className="grid place-items-center gap-4">
            <TextField
              placeholder="e.g. alex@email.com"
              icon="email"
              labelDisplay="Email address"
              label="email"
              register={register}
              required
              errorMessage={
                APIValidationError?.email || (errors.email && "Can't be empty")
              }
            />
            <TextField
              placeholder="Enter your password"
              icon="lock"
              labelDisplay="Password"
              label="password"
              type="password"
              register={register}
              required
              errorMessage={
                APIValidationError?.password ||
                (errors.password && "Can't be empty")
              }
            />
            <Button className="mt-2" disabled={mutation.isPending}>
              Login
            </Button>
            <div className="grid place-items-center mt-2">
              <p className="text-neutral-100">Don't have an account?</p>
              <Button type="transparent" link="/register">
                Create Account
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
