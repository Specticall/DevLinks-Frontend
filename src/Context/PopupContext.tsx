import { AnimatePresence, easeInOut, motion } from "framer-motion";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type TPopupFn = ({
  message,
  duration,
}: {
  message?: string;
  duration?: number;
}) => void;

type TPopupContext = {
  showPopup: TPopupFn;
};

type TOptions = {
  isShown: boolean;
  duration: number;
  message: string;
};

const PopupContext = createContext<TPopupContext | null>(null);

export function PopupProvider({ children }: { children: ReactNode }) {
  // const [isShown, setIsShown] = useState(false);
  // const [duration, setDuration] = useState(0);
  // const [message, setMessage] = useState("");

  const [{ isShown, duration, message }, setOptions] = useState<TOptions>({
    isShown: false,
    duration: 0,
    message: "Default Popup Message",
  });

  // Use to programmatically trigger a rerender
  const [trigger, setTrigger] = useState(Date.now());

  const showPopup: TPopupFn = ({
    message = "Default Popup Message",
    duration = 2000,
  }) => {
    setOptions({
      isShown: true,
      message,
      duration,
    });
    setTrigger(Date.now());
  };

  useEffect(() => {
    if (!isShown) return;
    const persistDuration = setTimeout(() => {
      setOptions((cur) => ({ ...cur, isShown: false }));
    }, duration);
    return () => {
      clearTimeout(persistDuration);
    };
  }, [isShown, duration, trigger]);

  return (
    <PopupContext.Provider
      value={{
        showPopup,
      }}
    >
      <AnimatePresence>
        {isShown && <Popup message={message} />}
      </AnimatePresence>
      {children}
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);
  if (!context) throw new Error("Context must be used it's its parent's scope");
  return context;
}

function Popup({ message }: { message: string }) {
  return (
    <motion.div
      className="fixed bg-neutral-100 text-body-m left-[50%] bottom-8 right-0 z-50 min-w-[calc(100vw-1.5rem)] text-white flex items-center justify-center py-3 px-4 rounded-lg text-center md:min-w-fit md:w-fit"
      initial={{
        opacity: 0,
        y: 100,
        x: "-50%",
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      exit={{
        y: 100,
        opacity: 0,
        x: "-50%",
      }}
      transition={{ duration: 0.3, ease: easeInOut }}
    >
      {message}
    </motion.div>
  );
}
