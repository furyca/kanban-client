import useModalStore from "@/store/modalStore";
import useTaskStore from "@/store/taskStore";
import { Minus, Plus } from "lucide-react";
import { DragOverlay, useDroppable } from "@dnd-kit/core";
import Task from "./Task";
import { Button } from "../ui/button";
import SkeletonTask from "./SkeletonTask";
import useProjectStore from "@/store/projectStore";

const TaskContainer = ({ title, index, id }: { title: string; index: number; id: string }) => {
  const { setModal } = useModalStore();
  const { activeTask, tasks, loadingTasks, setCurrentTaskStatus } = useTaskStore();
  const { setCurrentStatus, selectedProject } = useProjectStore();
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

  const openRemoveStatusModal = () => {
    setCurrentStatus({ id, text: title, project_id: selectedProject?.id || "" });
    setModal("remove_status");
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-[#3a52c93a] rounded-lg w-96 flex-shrink-0 h-full overflow-y-auto overflow-x-hidden self-start"
      data-testid={`task-container-${index}`}
    >
      <div className="flex justify-between items-center sticky top-0 backdrop-blur-sm p-2 z-[2] bg-zinc-900/50 border-b-2 border-slate-600 tracking-wide">
        <h3 className="text-base font-bold truncate">{title}</h3>
        <div>
          <Button variant="ghost" className="p-2 h-fit" onClick={openRemoveStatusModal} data-testid={`open-delete-status-modal-${id}`}>
            <Minus />
          </Button>
          <Button variant="ghost" className="p-2 h-fit" onClick={openAddTaskModal} data-testid={`open-create-task-modal-${index}`}>
            <Plus />
          </Button>
        </div>
      </div>
      <div className="p-1">
        {loadingTasks ? (
          <SkeletonTask />
        ) : (
          tasks
            .filter((task) => task.status === id)
            .map((task, index) => <Task key={task.id} index={index} {...task} />)
        )}
        <DragOverlay dropAnimation={null}>{activeTask && <Task {...activeTask} />}</DragOverlay>
      </div>
    </div>
  );
};

export default TaskContainer;
