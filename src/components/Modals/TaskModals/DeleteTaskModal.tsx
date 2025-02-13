import { Button } from "../../ui/button";
import useModalStore from "@/store/modalStore";
import useProjectStore from "@/store/projectStore";
import useTaskStore from "@/store/taskStore";
import { baseURL } from "@/utils/env";

const DeleteTaskModal = () => {
  const { setModal } = useModalStore();
  const { setTasks } = useTaskStore();
  const { selectedProject } = useProjectStore();
  const { activeTask } = useTaskStore();

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
      }
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const handleNoClick = () => {
    setModal("none");
  };
  return (
    <div
      className="flex flex-col justify-between text-center rounded-lg min-h-60 min-w-80 bg-gray-950 border-2 text-slate-200 p-8 shadow-card"
      data-testid="delete-task-modal"
    >
      <h2 className="block mb-2 font-bold text-3xl">Delete '{activeTask?.title}'?</h2>
      <div className="flex justify-between">
        <Button className="w-20 h-12" onClick={handleNoClick}>NO</Button>
        <Button className="bg-red-600 w-20 h-12" onClick={handleYesClick} data-testid="delete-task-confirm">
          YES
        </Button>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
