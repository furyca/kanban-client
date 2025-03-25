import useClickOutside from "@/hooks/useClickOutside";
import { Button } from "../../ui/button";
import useModalStore from "@/store/modalStore";
import useProjectStore from "@/store/projectStore";
import useTaskStore from "@/store/taskStore";
import { baseURL } from "@/utils/env";
import { LegacyRef } from "react";
import CloseButton from "../Form/Elements/CloseButton";

const DeleteTaskModal = () => {
  const ref = useClickOutside();
  const { setModal } = useModalStore();
  const { setTasks, activeTask, setActiveTask } = useTaskStore();
  const { selectedProject } = useProjectStore();

  const handleYesClick = async () => {
    try {
      const response = await fetch(`${baseURL}/delete_task`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: activeTask?.id, project_id: selectedProject?.id }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      if (json) {
        setTasks(json.tasks);
        setModal("none");
        setActiveTask(null);
      }
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const handleNoClick = () => {
    setModal("none");
    setActiveTask(null);
  };
  return (
    <div
      className="flex flex-col text-center rounded-lg h-3/4 w-2/5 bg-[#191735] border text-slate-200 py-4 shadow-card"
      data-testid="delete-task-modal"
      ref={ref as LegacyRef<HTMLDivElement>}
    >
      <section className="relative p-8">
        <h2 className="block font-bold text-2xl">Delete '{activeTask?.title}' task?</h2>
        <CloseButton />
      </section>
      <div className="overflow-auto flex flex-grow flex-col">
        {activeTask?.subtasks?.length === 0 ? (
          <>
            <h4>This task has no subtasks</h4>
          </>
        ) : (
          <>
            <h4 className="mb-4 text-base italic tracking-wider sticky top-0 bg-[#191735] p-2 underline underline-offset-2">
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
        <Button className="h-12 bg-zinc-700 hover:bg-zinc-800 text-[16px] px-4" onClick={handleNoClick}>
          No, Cancel
        </Button>
        <Button
          className="bg-red-600 h-12 hover:bg-red-800 text-[16px] px-4"
          onClick={handleYesClick}
          data-testid="delete-task-confirm"
        >
          Yes, Delete
        </Button>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
