import Task from "./Task";
import useModalStore from "@/store/modalStore";
import useTaskStore from "@/store/taskStore";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";

const TaskContainer = ({ title, index }: { title: string; index: number }) => {
  const { setModal } = useModalStore();
  const { tasks, setCreateTaskDefaultStatus } = useTaskStore();
  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-${index}`,
    data: {
      status: title,
      accepts: tasks.map((task) => task.id),
    },
  });

  const style = {
    color: isOver ? "green" : undefined,
  };

  const openAddTaskModal = () => {
    setCreateTaskDefaultStatus(title);
    setModal("create_task");
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg min-w-80 h-full overflow-y-auto overflow-x-hidden self-start"
      data-testid={`task-container-${index}`}
    >
      <div className="flex justify-between items-center sticky top-0 p-2 bg-gray-900 border-b-2 tracking-wide">
        <h3 className="text-base font-bold truncate">{title}</h3>
        <Button variant="ghost" size="sm" onClick={openAddTaskModal} data-testid={`open-create-task-modal-${index}`}>
          <Plus />
        </Button>
      </div>
      <div className="p-2 ">
        {tasks
          .filter((task) => task.status === title)
          .map((task, index) => (
            <Task key={index} index={index} {...task} />
          ))}
      </div>
    </div>
  );
};

export default TaskContainer;
