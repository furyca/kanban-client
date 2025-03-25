import Task from "./Task";
import useModalStore from "@/store/modalStore";
import useTaskStore from "@/store/taskStore";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { DragOverlay, useDroppable } from "@dnd-kit/core";

const TaskContainer = ({ title, index, id }: { title: string; index: number; id: string }) => {
  const { setModal } = useModalStore();
  const { activeTask, tasks, setCurrentTaskStatus } = useTaskStore();
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      status: id,
      accepts: tasks.map((task) => task.id),
    },
  });

  const style = {
    color: isOver ? "#3a52c9" : undefined,
  };

  const openAddTaskModal = () => {
    setCurrentTaskStatus(id);
    setModal("create_task");
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-b-0 border-[#3a52c93a] rounded-lg min-w-80 h-full overflow-y-auto overflow-x-hidden self-start"
      data-testid={`task-container-${index}`}
    >
      <div className="flex justify-between items-center sticky top-0 backdrop-blur-sm p-2 z-[2] bg-zinc-900/50 border-b-2 border-slate-600 tracking-wide">
        <h3 className="text-base font-bold truncate">{title}</h3>
        <Button variant="ghost" size="sm" onClick={openAddTaskModal} data-testid={`open-create-task-modal-${index}`}>
          <Plus />
        </Button>
      </div>
      <div className="p-1">
        {tasks
          .filter((task) => task.status === id)
          .map((task, index) => (
            <Task key={task.id} index={index} {...task} />
          ))}
        <DragOverlay dropAnimation={null}>
          {activeTask && <Task {...activeTask} />}
        </DragOverlay>
      </div>
    </div>
  );
};

export default TaskContainer;
