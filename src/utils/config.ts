import { LoaderFunction } from "react-router-dom";

export const API_URL = "http://127.0.0.1:9000";
export const BASE_URL = "localhost:5173";

export type LoaderData<TLoaderFunction extends LoaderFunction> = Awaited<
  ReturnType<TLoaderFunction>
> extends Response | infer whatever
  ? whatever
  : never;
