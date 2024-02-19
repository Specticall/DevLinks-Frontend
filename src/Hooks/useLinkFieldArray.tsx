import { useEffect, useState } from "react";
import {
  Control,
  FieldValues,
  UseFormGetValues,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { TLinkForm } from "../Pages/Link";
import { usePopup } from "../Context/PopupContext";
import { useLinkForm } from "../Context/LinkFormContext";

type TFormError = Record<number, Record<string, string>>;
type Props<T extends FieldValues = TLinkForm> = {
  control: Control<T>;
  getValues: UseFormGetValues<T>;
};

export const getEmptyFieldsError = (value: TLinkForm) => {
  return value.links.reduce((errors: TFormError, link, index) => {
    const URLEmpty = link.URL.length === 0;
    const platformEmpty = link.platform.length === 0;
    const invalidURL =
      !/\bhttps?:\/\/\S+/.test(link.URL) ||
      !link.URL.includes(link.platform.toLowerCase().split(" ").join(""));

    if (!URLEmpty && !platformEmpty && !invalidURL) return errors;

    errors[index] = {};

    // Empty Fields
    if (URLEmpty) errors[index]["URL"] = "Can't be empty";
    if (platformEmpty) errors[index]["platform"] = "Select a platform";

    // Invalid URL (contains)
    if (invalidURL) errors[index]["URL"] = `Invalid ${link.platform} URL`;

    return errors;
  }, {});
};

export function useLinkFieldArray({ control, getValues }: Props<TLinkForm>) {
  const { showPopup } = usePopup();
  const [fieldFormErrors, setFieldFormErrors] = useState<TFormError>({});

  const { fields, append, remove, swap } = useFieldArray<TLinkForm>({
    name: "links",
    control,
  });

  // Used to transfer data into the linkField context so it can be used throughout the AppLayout component
  const { setLinkFieldArray } = useLinkForm();

  const fieldArray = useWatch({
    control,
    name: "links",
    defaultValue: getValues("links"),
  });

  useEffect(() => {
    setLinkFieldArray(fieldArray);
  }, [fieldArray, setLinkFieldArray]);

  const handleAppendField = () => {
    // 1. Retrieve current form values
    const currentFormValues = getValues();

    // 2. Make sure every field is not empty before allowing user to append a new link
    const emptyFields = getEmptyFieldsError(currentFormValues);

    // 3. Show popup if user can't append
    if (Object.values(emptyFields).length > 0) {
      setFieldFormErrors(emptyFields);
      showPopup({
        message: "Please fill the current forms first",
        duration: 3000,
      });
      return;
    }

    // 4. Append new form
    append({
      platform: "",
      URL: "",
    });
    showPopup({
      message: "+ Added new link",
    });
  };

  const handleRemoveField = (i: number) => () => {
    remove(i);
    showPopup({
      message: "- Link removed",
    });
    setFieldFormErrors({});
  };

  return {
    handleAppendField,
    handleRemoveField,
    fields,
    fieldFormErrors,
    setFieldFormErrors,
    swap,
  };
}
