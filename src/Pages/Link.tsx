import { Controller, SubmitHandler, useForm } from "react-hook-form";
import EmptyList from "../Components/app/Link/EmptyList";
import Button from "../Components/utils/Button";
import TextField from "../Components/utils/TextField";
import LinkItem from "../Components/app/Link/LinkItem";
import DropDown from "../Components/utils/DropDown";
import { usePopup } from "../Context/PopupContext";
import axios from "axios";
import { API_URL } from "../utils/config";
import { useOutletContext } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { cookies } from "../utils/helper";
import { linkItemList } from "../utils/helper";
import {
  getEmptyFieldsError,
  useLinkFieldArray,
} from "../Hooks/useLinkFieldArray";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMultiKeystroke } from "../Hooks/useMultiKeyStroke";
import { useRef } from "react";
import { TUserResponse } from "./AppLayout";

export type TLinks = { platform: TPlatforms; URL: string; _id?: string };
export type TPlatforms = (typeof linkItemList)[number]["text"];

export type TLinkForm = {
  links: TLinks[];
};

export default function Link() {
  // Popup caller function
  const { showPopup } = usePopup();

  // Handles HTTP Requests
  const mutation = useMutation({
    mutationFn: (linkList: TLinks[]) => {
      return axios.put(`${API_URL}/api/v1/links`, linkList, {
        headers: {
          Authorization: `Bearer ${cookies.get("authToken")}`,
        },
      });
    },
    onError: (error) => {
      console.log("Failed to save data", error);
      showPopup({
        message: "Whoops, Something wen't wrong. Try again later!",
      });
    },
    onSuccess: () => {
      showPopup({
        message: "Your changes have been successfully saved!",
      });
    },
  });

  // Used to call `.requestSubmit()` outside the component.
  const formRef = useRef<null | HTMLFormElement>(null);

  // Retrieve Data
  const linkList = (useOutletContext() as TUserResponse).linkList;

  // Register the form to react hook form
  const { register, control, handleSubmit, getValues } = useForm<TLinkForm>({
    defaultValues: {
      links: linkList,
    },
  });

  // Prevent Click and Touch from dragging
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
      delay: 250,
    },
  });
  const sensors = useSensors(mouseSensor);

  // Extracted and coupled LinkField array
  const {
    handleAppendField,
    handleRemoveField,
    fields,
    fieldFormErrors,
    setFieldFormErrors,
    swap,
  } = useLinkFieldArray({
    control,
    getValues,
  });

  const onSubmit: SubmitHandler<TLinkForm> = (value) => {
    // 1. Retrieve fields that are empty.
    const emptyFields = getEmptyFieldsError(value);

    // 2. If no empty fields found then show error
    if (Object.values(emptyFields).length > 0 && value.links.length !== 0) {
      setFieldFormErrors(emptyFields);
      return;
    }
    // 3. Clear Form errors on success
    setFieldFormErrors({});

    // 4. Send the data to the server
    mutation.mutate(value.links);
  };

  // Handles save / submit using CTRL + S keystroke
  useMultiKeystroke({
    keyStrokes: ["Control", "s"],
    onKeydown: () => {
      (formRef.current as HTMLFormElement).requestSubmit();
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const toIndex = over?.data.current?.sortable.index;
    const fromIndex = active?.data.current?.sortable.index;

    swap(fromIndex, toIndex);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      ref={formRef}
      className="pt-6 max-w-[50rem]"
    >
      <h1 className="text-heading-s  font-bold mb-2">Customize your links</h1>
      <p className="text-body-m text-neutral-200 leading-normal">
        Add/edit/remove links below and thens hare your profiles with the world!
      </p>
      <Button
        type="secondary-small"
        className="mt-10"
        onClick={handleAppendField}
      >
        + Add new link
      </Button>
      {getValues("links").length > 0 ? (
        //////////////////////////// Links Field Array
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <ul className="w-full my-6 gap-6 flex flex-col mb-auto ">
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map(
                (field, index) => (
                  <LinkItem
                    index={index + 1}
                    key={field.id}
                    id={field.id}
                    onRemove={handleRemoveField(index)}
                  >
                    <Controller
                      control={control}
                      name={`links.${index}.platform`}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <DropDown
                            onSelect={onChange}
                            itemList={linkItemList}
                            keyname={field.id}
                            value={value}
                            labelDisplay="Platform"
                            errorMessage={
                              fieldFormErrors[index] &&
                              fieldFormErrors[index]["platform"]
                            }
                          />
                        );
                      }}
                    />

                    <TextField
                      labelDisplay="Link"
                      label={`links.${index}.URL`}
                      placeholder="e.g. https://github.com/joseph"
                      register={register}
                      errorMessage={
                        fieldFormErrors[index] && fieldFormErrors[index]["URL"]
                      }
                    />
                  </LinkItem>
                )
                //////////////////////////// Links Field Array
              )}
            </SortableContext>
          </ul>
        </DndContext>
      ) : (
        <EmptyList />
      )}
      <div className="w-full pt-4 border-t-[1px] border-neutral-300 [&>button]:w-[10rem] flex justify-end mt-8">
        <Button
          type="primary"
          className="text-body-m"
          disabled={mutation.isPending}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
