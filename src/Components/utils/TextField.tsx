import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import Icons, { TIconProp } from "./Icons";

type Props<T extends FieldValues> = {
  placeholder: string;
  icon?: TIconProp["icon"] | "none";
  errorMessage?: string;
  labelDisplay: string;
  type?: string;
  className?: string;
  options?: RegisterOptions<T>;
  // Converted to camel case then to react hook from string
  // React Hook Form
  label: Path<T>;
  register: UseFormRegister<T>;
  required?: boolean;
};

export default function TextField<T extends FieldValues>({
  placeholder = "Text Field Empty",
  icon = "link" as const,
  label,
  errorMessage,
  type = "text",
  register,
  options = {},
  labelDisplay = "",
  required,
  className = "",
}: Props<T>) {
  // If no label display provided make it tha same as the form's label
  if (!labelDisplay) labelDisplay = label;
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        {labelDisplay && (
          <p className="text-neutral-100 text-body-s  whitespace-nowrap">
            {labelDisplay}
          </p>
        )}
        <p className="text-end w-full text-red text-body-s text-accent-red">
          {errorMessage || ""}
        </p>
      </div>
      <div className="relative">
        <input
          type={type}
          className={`${className} text-body-m py-3 pr-4 pl-12 border-neutral-300 border-[1.5px] rounded-lg w-full text-neutral-100 [&:placeholder]:text-neutral-300 outline-none hover:border-accent-100 bg-white hover:shadow-lg hover:shadow-accent-100/20 cursor-pointer focus:border-accent-100 ${
            errorMessage ? "[&]:border-accent-red" : ""
          }`}
          placeholder={placeholder}
          {...register(label, { ...options, required })}
          style={{ paddingLeft: icon === "none" ? "1rem" : "3rem" }}
        />
        {icon !== "none" && (
          <div className="absolute top-[50%] left-[1rem] translate-y-[-50%]">
            <Icons icon={icon} />
          </div>
        )}
      </div>
    </div>
  );
}
