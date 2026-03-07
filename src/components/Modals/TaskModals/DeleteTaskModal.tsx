import useClickOutside from "@/hooks/useClickOutside";
import useModalStore from "@/store/modal/modal.store";
import { LegacyRef } from "react";
import CloseButton from "../FormElements/CloseButton";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModalTaskId } from "@/store/modal/modal.selectors";
import useTaskStore from "@/store/tasks/task.store";
import { useActiveTask } from "@/store/tasks/task.selectors";

const DeleteTaskModal = () => {
  const ref = useClickOutside();
  const currentTaskId = useModalTaskId();
  const clearContext = useModalStore((s) => s.clearContext);
  const activeTask = useActiveTask();
  const loadingTasks = useTaskStore((s) => s.loadingTasks);
  const deleteTask = useTaskStore((s) => s.deleteTask);  

  const handleYesClick = async () => {
    deleteTask(currentTaskId!);
  };

  const handleNoClick = () => {
    clearContext();
  };
  return (
    <div
      className="flex flex-col text-center rounded-lg h-3/4 w-11/12 md:w-2/3 lg:w-1/2 2xl:w-2/5 bg-[#191735] border text-slate-200 py-4 shadow-card"
      data-testid="delete-task-modal"
      ref={ref as LegacyRef<HTMLDivElement>}
    >
      <section className="md:p-8 p-3 relative">
        <h2 className="md:text-2xl text-base block font-bold">Delete '{activeTask?.title}' task?</h2>
        <CloseButton />
      </section>
      <div className="overflow-auto flex flex-grow flex-col">
        {activeTask?.subtasks?.length === 0 ? (
          <>
            <h4>This task has no subtasks</h4>
          </>
        ) : (
          <>
            <h4 className="md:text-base md:mb-4 text-sm mb-2 italic tracking-wider sticky top-0 bg-[#191735] p-2 underline underline-offset-2">
              Following subtasks wil be deleted as well!
            </h4>
            <div className="text-start text-base flex flex-col flex-grow p-2 px-4">
              {activeTask?.subtasks?.map((subtask, index) => (
                <p
                  key={index}
                  className={`mb-1 border-b border-slate-500/50 p-1 ${subtask.completed ? "line-through" : ""}`}
                  data-testid="subtask-text"
                >
                  - {subtask.text}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex justify-between mt-auto border-t border-gray-600 pt-4 px-4">
        <Button
          className="h-12 bg-zinc-700 hover:bg-zinc-800 text-[16px] px-4"
          onClick={handleNoClick}
          disabled={loadingTasks}
        >
          No, Cancel
        </Button>
        <Button
          className="bg-red-600 h-12 hover:bg-red-800 text-[16px] px-4"
          onClick={handleYesClick}
          data-testid="delete-task-confirm"
          disabled={loadingTasks}
        >
          {loadingTasks && <LoaderCircle className="animate-spin" />}
          Yes, Delete
        </Button>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
