import { Minus, Plus } from "lucide-react";
import { DragOverlay, useDroppable } from "@dnd-kit/core";
import Task from "./Task";
import { Button } from "../ui/button";
import useModalStore from "@/store/modal/modal.store";
import useTaskStore from "@/store/tasks/task.store";
import { useGrabbedTask, useTasksByStatus } from "@/store/tasks/task.selectors";
import SkeletonTask from "./SkeletonTask";
import { TaskProps } from "@/store/tasks/type";

const TaskContainer = ({ id, text }: { id: string; text: string }) => {
  const setModal = useModalStore((s) => s.setModal);
  const tasks = useTasksByStatus(id);
  const grabbedTask = useGrabbedTask();
  const grabbedTaskID = useTaskStore((s) => s.grabbedTaskID);
  const setCurrentStatusId = useModalStore((s) => s.setCurrentStatusId);
  const loading = useTaskStore((s) => s.loadingTasks);
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: {
      statusID: id,
      accepts: tasks.map((t) => t.id),
    },
  });  

  const openAddTaskModal = () => {
    setCurrentStatusId(id);
    setModal("create_task");
  };

  const openRemoveStatusModal = () => {
    setCurrentStatusId(id);
    setModal("remove_status");
  };  

  return (
    <div
      ref={setNodeRef}
      data-testid={`task-container-${id}`}
      className="border border-[#3a52c93a] rounded-lg w-96 flex-shrink-0 h-full overflow-y-auto overflow-x-hidden self-start"
      style={{ color: isOver ? "#3a52c9" : undefined }}
    >
      {/* HEADER */}
      <div
        title={text}
        className="flex justify-between items-center sticky top-0 backdrop-blur-sm p-2 z-[2] bg-zinc-900/50 border-b-2 border-slate-600 tracking-wide"
      >
        <h3 className="text-base font-bold truncate">{text}</h3>

        <div>
          <Button
            variant="ghost"
            className="p-2 h-fit"
            onClick={openRemoveStatusModal}
            title="Remove Status"
            data-testid={`open-delete-status-modal-${id}`}
          >
            <Minus />
          </Button>

          <Button
            variant="ghost"
            className="p-2 h-fit"
            onClick={openAddTaskModal}
            title="Add Task"
            data-testid={`open-create-task-modal-${id}`}
          >
            <Plus />
          </Button>
        </div>
      </div>

      {/* TASK LIST */}
      {loading ? (
        <SkeletonTask />
      ) : (
        <div className="p-1">
          {tasks.map((task) => (
            <Task key={task.id} {...task} />
          ))}

          <DragOverlay dropAnimation={null}>
            {grabbedTaskID && grabbedTaskID === id && <Task {...(grabbedTask as TaskProps)} />}
          </DragOverlay>
        </div>
      )}
    </div>
  );
};

export default TaskContainer;
