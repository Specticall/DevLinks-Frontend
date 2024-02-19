import { motion } from "framer-motion";
import { TLinks } from "../../Pages/AppLayout";
import { findPlatformIconAndColor } from "../../utils/helper";
import Icons from "../utils/Icons";
import { useLocation } from "react-router-dom";

type Props = TLinks & {
  index: number;
  className?: string;
};

export default function LinkCard({ platform, URL, index, className }: Props) {
  const { color, icon } = findPlatformIconAndColor(platform);
  const location = useLocation();

  return (
    <motion.li
      layoutId={`${URL}${platform}`}
      layout={location.pathname.includes("/app/link") ? "position" : false}
      className={`rounded-lg`}
      key={`Item_${index}`}
      style={{ background: color }}
    >
      <a
        href={URL}
        className={`flex justify-between p-4 py-6 items-center ${className}`}
        target="_blank"
      >
        <div className="flex gap-2 items-center">
          <Icons icon={icon} color="white" />
          <p className="text-white">{platform}</p>
        </div>
        <Icons icon="arrowRight" />
      </a>
    </motion.li>
  );
}
