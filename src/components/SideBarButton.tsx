import { Button } from "./ui/button";
import { Edit, Trash } from "lucide-react";
import useModalStore from "@/store/modalStore";
import useProjectStore, { ProjectProps } from "@/store/projectStore";

const SideBarButton = ({ title, id, description, statuses }: ProjectProps) => {
  const { setModal } = useModalStore();
  const { selectedProject, setSelectedProject } = useProjectStore();

  const openDeleteProjectModal = () => {
    setModal("delete_project");
    setSelectedProject({ title, id, description, statuses });
  };

  const openUpdateProjectModal = () => {
    setModal("update_project");
    setSelectedProject({ title, id, description, statuses });
  };

  return (
    <div className="flex justify-between">
      <Button
        className={`mb-2 justify-start bg-zinc-900 ${selectedProject?.id === id && 'bg-white text-black'}`}
        variant="ghost"
        onClick={() => setSelectedProject({title, id, description, statuses})}
      >
        {title}
      </Button>
      <Button className="ms-4 bg-zinc-900 bg-transparent" onClick={openUpdateProjectModal}>
        <Edit />
      </Button>
      <Button className="ms-4 text-red-500 bg-transparent" onClick={openDeleteProjectModal}>
        <Trash />
      </Button>
    </div>
  );
};

export default SideBarButton;
