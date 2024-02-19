import { useEffect, useState } from "react";

interface Props {
  keyStrokes: string[];
  onKeydown?: () => void;
}

export function useMultiKeystroke({ keyStrokes, onKeydown = () => {} }: Props) {
  const [pressedKey, setPressedKey] = useState<string[]>([]);
  const [handlerFired, setHandlerFired] = useState(false);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (pressedKey.length === keyStrokes.length - 1 && !handlerFired) {
        const isValid = [...pressedKey, e.key].every(
          (key, i) => key === keyStrokes[i]
        );

        if (!isValid) return;
        e.preventDefault();
        onKeydown();
        setHandlerFired(true);
      }

      setPressedKey((current) => {
        if (e.key === current[current.length - 1]) return current;
        console.log([...current, e.key], e.key);
        return [...current, e.key];
      });
    };

    const handleKeyup = (e: KeyboardEvent) => {
      console.log("KEYUP");
      e.preventDefault();

      setPressedKey((current) => {
        return current.filter((key) => key !== e.key);
      });

      setHandlerFired(false);
    };

    window.addEventListener("keyup", handleKeyup);
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keyup", handleKeyup);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [keyStrokes, onKeydown, pressedKey, handlerFired]);

  return;
}
