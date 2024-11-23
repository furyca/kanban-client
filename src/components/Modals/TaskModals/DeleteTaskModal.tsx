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
        setTasks(json.tasks)
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
    <div className="flex flex-col gap-4 rounded-sm bg-slate-500 p-8">
      <h2>Delete '{activeTask?.title}'?</h2>
      <div className="flex justify-between">
        <Button onClick={handleNoClick}>NO</Button>
        <Button className="bg-red-600" onClick={handleYesClick}>
          YES
        </Button>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
