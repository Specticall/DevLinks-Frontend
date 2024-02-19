import { useEffect } from "react";

export function useClickOutside(
  onClickOutside = () => {},
  elementClass: string
) {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const clickedElement = e.target as HTMLElement;
      if (clickedElement.closest(elementClass)) return;

      onClickOutside();
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [elementClass, onClickOutside]);
}
