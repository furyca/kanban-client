import { ChevronDown, ChevronUp, Edit, Trash } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import useModalStore from "@/store/modal/modal.store";
import { useTaskSubtasks } from "@/store/tasks/task.selectors";
import { TaskProps } from "@/store/tasks/type";

const Task = ({ id, title, created_at, updated_at }: TaskProps) => {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const setModal = useModalStore((s) => s.setModal);
  const subtasks = useTaskSubtasks(id);
  const setCurrentTaskId = useModalStore((s) => s.setCurrentTaskId);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const style = transform ? { opacity: 0 } : undefined;
  const formattedCreationDate = format(new Date(created_at), "d MMM yyyy HH:mm");
  const formattedUpdateDate = format(new Date(updated_at), "d MMM yyyy HH:mm");

  const openDeleteTaskModal = () => {
    setCurrentTaskId(id);
    setModal("delete_task");
  };

  const openEditTaskModal = () => {
    setCurrentTaskId(id);
    setModal("update_task");
  };

  useEffect(() => {
    setContentHeight(contentRef.current?.scrollHeight ?? 0);
  }, [subtasks?.length]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      data-testid="task"
      className="cursor-grab active:cursor-grabbing border-zinc-500 border rounded-lg p-2 bg-white/10 select-none mt-5 first:mt-1 group relative"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold truncate">{title}</h3>

        <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
          <Button
            variant="ghost"
            size="sm"
            onClick={openEditTaskModal}
            title="Edit Task"
            data-testid={`open-update-task-modal-${id}`}
            className="p-1.5 h-fit rounded-sm bg-violet-500 text-white md:bg-transparent md:text-violet-400 hover:bg-violet-600 hover:text-white"
          >
            <Edit size={16} strokeWidth={1.5} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={openDeleteTaskModal}
            title="Delete Task"
            data-testid={`open-delete-task-modal-${id}`}
            className="p-1.5 h-fit rounded-sm bg-red-900 text-white md:bg-transparent md:text-red-600 hover:bg-red-800 hover:text-white"
          >
            <Trash size={16} strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      {/* SUBTASKS */}
      <div
        ref={contentRef}
        style={{
          maxHeight: expanded ? contentHeight : 0,
          opacity: expanded ? 1 : 0,
        }}
        className="transition-all duration-500 delay-75 overflow-hidden pb-2"
      >
        {subtasks?.length ? (
          subtasks.map(({ id, text, completed }) => (
            <p key={id} className={`mb-1 last:mb-3 text-sm ${completed ? "line-through" : ""}`}>
              - {text}
            </p>
          ))
        ) : (
          <p className="mb-2 text-sm">No subtasks</p>
        )}
      </div>

      {/* DATES */}
      <div className="flex justify-between items-center mb-2 text-xs font-bold tracking-tight">
        <p title="Created">{formattedCreationDate}</p>
        <p title="Updated">{formattedUpdateDate}</p>
      </div>

      {/* EXPAND BUTTON */}
      <div className="absolute z-[1] w-full left-0 -bottom-4 cursor-auto">
        <div
          onClick={() => setExpanded((p) => !p)}
          title={expanded ? "Collapse" : "Expand"}
          className="bg-indigo-950/80 w-8 h-8 rounded-full mx-auto flex justify-center items-center cursor-pointer border border-violet-700 transition-transform hover:scale-125 hover:border-2"
        >
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
    </div>
  );
};

export default Task;
