import { ReactNode } from "react";
import Icons from "../../utils/Icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface LinkListProps {
  index: number;
  children: ReactNode;
  id: string;
  onRemove: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export default function LinkItem({
  index,
  children,
  onRemove,
  id,
}: LinkListProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="grid gap-4 p-4 bg-neutral-350 rounded-lg cursor-pointer"
    >
      <div className="flex items-center w-full gap-2">
        <div>
          <Icons icon="twolines" />
        </div>
        <p className="flex-1 text-body-m font-semi-bold text-neutral-200">
          Link #{index}
        </p>
        <button className="text-neutral-200 text-body-m" onClick={onRemove}>
          Remove
        </button>
      </div>
      {children}
    </li>
  );
}
