import { Edit, Trash } from "lucide-react";
import { Button } from "./ui/button";
import useModalStore from "@/store/modalStore";
import useTaskStore, { TaskProps } from "@/store/taskStore";
import { useDraggable } from "@dnd-kit/core";
import { format } from "date-fns";

const Task = ({ id, title, subtasks, status, created_at, index, ...props }: TaskProps) => {
  const { setModal } = useModalStore();
  const { setActiveTask } = useTaskStore();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const inputDate = new Date(created_at);
  const formattedDate = format(inputDate, "d MMM yyyy HH:mm");
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  const openDeleteTaskModal = () => {
    setActiveTask({ id, title, subtasks, status, created_at, ...props });
    setModal("delete_task");
  };
  const openEditTaskModal = () => {
    setActiveTask({ id, title, subtasks, status, created_at, ...props });
    setModal("update_task");
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="border-zinc-500 border-2 rounded-lg p-2 bg-white/10 cursor-grab select-none"
      data-testid="task"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold truncate">{title}</h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            onClick={openEditTaskModal}
            data-testid={`open-update-task-modal-${index}`}
            className="hover:bg-white hover:text-black px-2 py-1"
          >
            <Edit className="h-2 w-2" />
          </Button>
          <Button
            variant="ghost"
            className="text-red-500 hover:bg-red-800 hover:text-red-100 px-2 py-1"
            onClick={openDeleteTaskModal}
            data-testid={`open-delete-task-modal-${index}`}
          >
            <Trash className="h-2 w-2" />
          </Button>
        </div>
      </div>
      {subtasks && subtasks?.length > 0 ? (
        subtasks.map(({ text, id, completed }) => (
          <p key={id} className={`mb-2 text-sm line-clamp-3 text-wrap ${completed && "line-through"}`}>
            - {text}
          </p>
        ))
      ) : (
        <p className="mb-2 text-sm">No subtasks</p>
      )}
      <p className="mb-2 text-xs">{formattedDate}</p>
    </div>
  );
};

export default Task;
