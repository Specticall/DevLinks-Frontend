import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { TLinks } from "../Pages/Link";

type TLinkFormContext = {
  linkFieldArray: TLinks[] | null;
  setLinkFieldArray: Dispatch<SetStateAction<TLinks[] | null>>;
};

type TLinkFormProps = {
  children: ReactNode;
};

const LinkFormContext = createContext<null | TLinkFormContext>(null);

export function LinkFormProvider({ children }: TLinkFormProps) {
  const [linkFieldArray, setLinkFieldArray] = useState<TLinks[] | null>(null);

  return (
    <LinkFormContext.Provider value={{ linkFieldArray, setLinkFieldArray }}>
      {children}
    </LinkFormContext.Provider>
  );
}

export function useLinkForm() {
  const context = useContext(LinkFormContext);
  if (!context)
    throw new Error(
      "Link Form Context can't be used outside of its provider's scope!"
    );
  return context;
}
