import useProjectStore from "@/store/projectStore";
import useModalStore from "@/store/modalStore";
import { baseURL } from "@/utils/env";
import { Button } from "@/components/ui/button";

const DeleteProjectModal = () => {
  const { setProjects, selectedProject } = useProjectStore();
  const { setModal } = useModalStore();

  const handleYesClick = async () => {
    try {
      const response = await fetch(`${baseURL}/delete_project`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: selectedProject?.id }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      if (json) {
        setProjects([...json.projects]);
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
      <h2>Delete '{selectedProject?.title}'?</h2>
      <div className="flex justify-between">
        <Button onClick={handleNoClick}>NO</Button>
        <Button className="bg-red-600" onClick={handleYesClick}>
          YES
        </Button>
      </div>
    </div>
  );
};

export default DeleteProjectModal;
