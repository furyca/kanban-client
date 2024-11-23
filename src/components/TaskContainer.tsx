import Task from "./Task";
import useModalStore from "@/store/modalStore";
import useTaskStore from "@/store/taskStore";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

const TaskContainer = ({ title }: { title: string }) => {
  const { setModal } = useModalStore();
  const { tasks } = useTaskStore();

  const openAddTaskModal = () => {
    setModal("create_task");
  };
  return (
    <div className="flex flex-col gap-4 border-2 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3>{title}</h3>
        <Button variant="ghost" size="sm" onClick={openAddTaskModal}>
          <Plus />
        </Button>
      </div>
      {tasks
        .filter((task) => task.status === title)
        .map((task, index) => (
          <Task key={index} {...task} />
        ))}
    </div>
  );
};

export default TaskContainer;
