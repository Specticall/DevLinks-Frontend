import { ChangeEvent, useRef, useState } from "react";
import { API_URL } from "../../utils/config";
import Icons from "../utils/Icons";
import { FieldValues, UseFormRegister, Path } from "react-hook-form";

type Props<TFormFields extends FieldValues> = {
  profileURL: string;
  inputImage?: string | Blob;
  formLabel: Path<TFormFields>;
  register: UseFormRegister<TFormFields>;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function ProfileForm<TFormFields extends FieldValues>({
  profileURL,
  inputImage,
  register,
  formLabel,
  onImageChange,
}: Props<TFormFields>) {
  // Flags for when HTML throws a native broken image error
  const [imageExist, setImageExist] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleBrokenImage = () => {
    setImageExist(false);
  };

  const { ref: formRef, ...formDependencies } = register(formLabel);

  const handleOpenFileExplorer = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="mt-6 w-[14rem] h-[14rem] rounded-lg flex flex-col  justify-center items-center gap-2 overflow-hidden relative group-hover:opacity-100 [&:hover_>_.tint]:bg-black/40 [&&:hover_*]:opacity-100 cursor-pointer"
      style={{ background: imageExist ? "none" : "#EFEBFF" }}
      onClick={handleOpenFileExplorer}
    >
      <div className="tint w-full h-full bg-black/0 absolute transition-all grid place-items-center">
        <input
          type="file"
          placeholder="test"
          accept="image/png, image/jpg"
          {...formDependencies}
          ref={(el) => {
            formRef(el);
            fileInputRef.current = el;
          }}
          onChange={onImageChange}
          className="hidden"
        />
        <div className="text flex flex-col items-center justify-center [&_*]:text-white opacity-0 transition-all">
          <Icons icon="picture" color="#FFF" />
          <p className="font-semi-bold text-accent-100">+ Upload Image</p>
        </div>
      </div>
      {imageExist || inputImage ? (
        <img
          src={
            (typeof inputImage === "string" && inputImage) ||
            `${API_URL}/api/v1/files/${profileURL}`
          }
          onError={handleBrokenImage}
          className="object-cover w-full h-full"
        ></img>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Icons icon="picture" color="#633CFF" />
          <p className="font-semi-bold text-accent-100">+ Upload Image</p>
        </div>
      )}
    </div>
  );
}
