import { Edit, Trash } from "lucide-react";
import { Button } from "./ui/button";
import useModalStore from "@/store/modalStore";
import useTaskStore, { TaskProps } from "@/store/taskStore";

const Task = ({ title, description, status, created_at, ...props }: TaskProps) => {
  const { setModal } = useModalStore();
  const { setActiveTask } = useTaskStore();

  const openDeleteTaskModal = () => {
    setActiveTask({ title, description, status, created_at, ...props });
    setModal("delete_task");
  };
  const openEditTaskModal = () => {
    setActiveTask({ title, description, status, created_at, ...props });
    setModal("update_task");
  };
  return (
    <div className="border-zinc-600 border-2 rounded-lg p-4 w-60">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={openEditTaskModal}>
            <Edit />
          </Button>
          <Button variant="ghost" size="sm" className="ms-4 text-red-500 bg-transparent" onClick={openDeleteTaskModal}>
            <Trash />
          </Button>
        </div>
      </div>

      <p className="mb-2">{description}</p>
      <p className="mb-2 text-sm">{created_at}</p>
    </div>
  );
};

export default Task;
