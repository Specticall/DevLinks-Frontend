import { useState } from "react";
import Icons, { TIconProp } from "./Icons";
import { useClickOutside } from "../../Hooks/useClickOutside";

export type TItem = {
  icon?: string & TIconProp["icon"];
  text: string;
  color?: string;
};

type Props = {
  itemList: TItem[];
  className?: string;
  onSelect?: (value: string) => void;
  value?: string;
  isOpen?: boolean;
  keyname: string;
  errorMessage?: string;
  labelDisplay?: string;
};

export default function DropDown({
  className,
  itemList,
  isOpen: isOpenDefaultValue,
  value,
  keyname,
  onSelect = () => {},
  errorMessage,
  labelDisplay,
}: Props) {
  const valueIndex = itemList.findIndex((item) => item.text === value);

  const [isOpen, setIsOpen] = useState(isOpenDefaultValue);
  const [selected, setSelected] = useState(valueIndex ?? -1);

  const hasIcon = itemList[0].icon;
  const useHasSelected = valueIndex !== -1;

  useClickOutside(() => setIsOpen(false), `.dropdown-container__${keyname}`);

  const handleToggle = () => {
    setIsOpen((cur) => !cur);
  };

  const handleSelect = (i: number) => () => {
    setSelected(i);
    onSelect(itemList[i].text);
  };
  return (
    <div className={`dropdown-container__${keyname}`}>
      <div className="flex justify-between mb-1">
        <p className="text-neutral-100 text-body-s  whitespace-nowrap">
          {labelDisplay || ""}
        </p>
        <p className="text-end w-full text-red text-body-s text-accent-red">
          {errorMessage || ""}
        </p>
      </div>
      <div
        className={`${className} text-body-m py-3 pr-4 pl-12 border-neutral-300 border-[1.5px] rounded-lg w-full text-neutral-100 [&:placeholder]:text-neutral-300 outline-none hover:border-accent-100 bg-white hover:shadow-lg hover:shadow-accent-100/20 cursor-pointer focus:border-accent-100 relative ${
          errorMessage ? "[&]:border-accent-red" : ""
        }`}
        style={{ paddingLeft: hasIcon ? "3rem" : "1rem" }}
        onClick={handleToggle}
      >
        <p className="text-body-m leading-normal">
          {useHasSelected ? itemList[selected].text : "Select a platform"}
        </p>
        {hasIcon && (
          <div className="absolute top-[50%] left-[1rem] translate-y-[-50%]">
            <Icons icon={useHasSelected ? itemList[selected].icon : "link"} />
          </div>
        )}
        {/* ////////////////////////////////////////// */}
        <ul className="absolute top-[4rem] left-0 right-0 bg-white z-10 grid shadow-lg rounded-lg max-h-[15rem] overflow-auto">
          {isOpen &&
            itemList.map((item, i) => {
              return (
                <li
                  key={`${keyname}${i}__dropdownelement`}
                  className="py-3 px-4 flex items-center justify-start gap-4 hover:bg-slate-50"
                  style={{
                    borderBottom:
                      i < itemList.length ? "1px solid #D9D9D9" : "",
                    color: i === selected ? "#633CFF" : "#737373",
                  }}
                  onClick={handleSelect(i)}
                >
                  <div>
                    {hasIcon && (
                      <Icons
                        icon={item.icon}
                        color={i === selected ? "#633CFF" : "#737373"}
                      />
                    )}
                  </div>
                  <p className="text-body-m">
                    {item.text}
                    {i === selected ? " (Selected)" : ""}
                  </p>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}
