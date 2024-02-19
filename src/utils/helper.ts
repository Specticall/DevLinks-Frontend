import { Cookies } from "react-cookie";
import { TValidationErrorValue } from "../Pages/Register";
import { TItem } from "../Components/utils/DropDown";

export type APIResponse<T> = {
  status: number;
  statusCode: number;
  data: T;
};

export function expandErrorMessage(errorMessage: TValidationErrorValue) {
  switch (errorMessage) {
    case "minLength":
      return "Must contain 8 characters";
    case "required":
      return "Can't be empty";
    case "samePassword":
      return "Doesn't match";
    case "duplicateEmail":
      return "Email already registered";
    default:
      return "Invalid Field";
  }
}

export function errorObjectToArray<TArray extends Record<string, string>>(
  arr: TArray[],
  mapFn: (value: string) => string = (val) => val
) {
  return arr.reduce((obj: Record<string, string>, value) => {
    const [[key, val]] = Object.entries(value);
    obj[key] = mapFn(val);
    return obj;
  }, {});
}
export const cookies = new Cookies();

export const linkItemList: TItem[] = [
  { icon: "github", text: "GitHub", color: "#1A1A1A" },
  { icon: "frontendMentor", text: "Frontend Mentor", color: "#FFFFFF" },
  { icon: "twitter", text: "Twitter", color: "#43B7E9" },
  { icon: "linkedIn", text: "LinkedIn", color: "#2D68FF" },
  { icon: "youtube", text: "Youtube", color: "#EE3939" },
  { icon: "facebook", text: "Facebook", color: "#2442AC" },
  { icon: "twitch", text: "Twitch", color: "#EE3FC8" },
  { icon: "devto", text: "Dev.to", color: "#333333" },
  { icon: "codewars", text: "Codewars", color: "#8A1A50" },
  { icon: "freecodecamp", text: "freeCodeCamp", color: "#302267" },
  { icon: "gitlab", text: "GitLab", color: "#EB4925" },
  { icon: "hashnode", text: "Hashnode", color: "#0330D1" },
  { icon: "stackoverflow", text: "Stack Overflow", color: "#EC7100" },
];

export function findPlatformIconAndColor(platform: string) {
  const item = linkItemList.find((item) => item.text === platform);
  return { icon: item?.icon || "link", color: item?.color || "#000" };
}

export const isNumericString = (input: string): boolean =>
  /^[0-9]+$/.test(input);

export const isAlphabetic = (input: string): boolean =>
  /^[a-zA-Z]+$/.test(input);

export const slugify = (input: string) => {
  return input
    .toLowerCase()
    .split("")
    .reduce((slug: string[], letter): string[] => {
      if (isNumericString(letter) || isAlphabetic(letter)) {
        return [...slug, letter];
      }

      let delimiterExist = false;
      for (let j = slug.length - 1; j >= 0; j--) {
        if (j < 0 || slug[j] !== "-") {
          return delimiterExist ? slug : [...slug, "-"];
        }
        if (slug[j] === "-") delimiterExist = true;
      }

      return slug;
    }, [])
    .join("");
};
