import { MouseEventHandler, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const buttonStyles: {
  primary: string;
  secondary: string;
  transparent: string;
  "secondary-small": string;
} = {
  primary:
    "bg-accent-100 active:bg-accent-200 active:shadow-lg active:shadow-neutral-100/10 disabled:bg-accent-300 text-white font-semi-bold",
  secondary:
    "text-accent-100 border-accent-100 border-[1.5px] active:bg-accent-300 disabled:opacity-50 font-semi-bold",
  transparent: "text-accent-100 w-fit hover:text-accent-200 [&&]:p-0",
  "secondary-small":
    "text-accent-100 border-accent-100 border-[1px] active:bg-accent-300 disabled:opacity-50 font-semi-bold text-body-m [&&]:py-2",
};

type Props = {
  children: ReactNode;
  className?: string;
  link?: string;
  width?: string | "full";
  type?: keyof typeof buttonStyles;
  disabled?: boolean;
  onClick?: () => void | undefined;
};

export default function Button({
  children = <>"text"</>,
  className,
  link = "",
  type = "primary",
  width = "full",
  disabled = false,
  onClick,
}: Props) {
  const navigate = useNavigate();

  const handleClick: MouseEventHandler = (e) => {
    if (link.length > 0) navigate(link);
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      className={`${className} ${buttonStyles[type]}  rounded-lg w-full p-3 `}
      style={{ maxWidth: width === "full" ? "100%" : width }}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
