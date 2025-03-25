import { ChevronDown, ChevronUp, Edit, Trash } from "lucide-react";
import { Button } from "./ui/button";
import useModalStore from "@/store/modalStore";
import useTaskStore, { TaskProps } from "@/store/taskStore";
import { useDraggable } from "@dnd-kit/core";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

const Task = ({ id, title, subtasks, status, created_at, updated_at, index, ...props }: TaskProps) => {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const content = useRef<HTMLDivElement>(null);
  const { setModal } = useModalStore();
  const { setActiveTask } = useTaskStore();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const creation_date = new Date(created_at);
  const update_date = new Date(updated_at);
  const formattedCreationDate = format(creation_date, "d MMM yyyy HH:mm");
  const formattedUpdateDate = format(update_date, "d MMM yyyy HH:mm");

  const style = transform ? { opacity: 0 } : undefined;

  const openDeleteTaskModal = () => {
    setActiveTask({ id, title, subtasks, status, created_at, updated_at, ...props });
    setModal("delete_task");
  };
  const openEditTaskModal = () => {
    setActiveTask({ id, title, subtasks, status, created_at, updated_at, ...props });
    setModal("update_task");
  };

  useEffect(() => {
    setContentHeight(content.current?.scrollHeight as number);
  }, [subtasks]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing border-zinc-500 border rounded-lg p-2 bg-white/10 select-none mt-5 first:mt-1 group relative`}
      data-testid="task"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold truncate">{title}</h3>
        <div className="flex gap-1 transition-all duration-200 ease-in-out opacity-0 group-hover:opacity-100">
          <Button
            variant="ghost"
            onClick={openEditTaskModal}
            data-testid={`open-update-task-modal-${index}`}
            className="px-3 border-none shadow-none bg-transparent text-violet-400 hover:bg-violet-600 hover:text-white"
          >
            <Edit className="h-1 w-1" />
          </Button>
          <Button
            variant="ghost"
            className="px-3 border-none shadow-none bg-transparent text-red-600 hover:bg-red-800 hover:text-white"
            onClick={openDeleteTaskModal}
            data-testid={`open-delete-task-modal-${index}`}
          >
            <Trash className="h-1 w-1" />
          </Button>
        </div>
      </div>
      <div
        style={{ maxHeight: expanded ? contentHeight : 0, opacity: expanded ? 100 : 0 }}
        className={`transition-all duration-500 delay-75 overflow-hidden pb-2`}
        ref={content}
      >
        {subtasks && subtasks?.length > 0 ? (
          subtasks.map(({ text, id, completed }) => (
            <p key={id} className={`mb-1 last:mb-3 text-sm line-clamp-3 text-wrap ${completed && "line-through"}`}>
              - {text}
            </p>
          ))
        ) : (
          <p className="mb-2 text-sm">No subtasks</p>
        )}
      </div>
      <div className="flex justify-between items-center mb-2 text-xs">
        <p>{formattedCreationDate}</p>
        <p>{formattedUpdateDate}</p>
      </div>
      <div className="absolute z-[1] w-full left-0 -bottom-4 cursor-auto">
        <div
          className="bg-indigo-950/80 w-8 h-8 rounded-full mx-auto flex justify-center items-center cursor-pointer border border-violet-700 transition-transform delay-75 duration-300 hover:scale-125 hover:border-2"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
    </div>
  );
};

export default Task;
