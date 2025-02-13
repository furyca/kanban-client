import { Button } from "./ui/button";
import { Edit, Trash } from "lucide-react";
import useModalStore from "@/store/modalStore";
import useProjectStore, { ProjectProps } from "@/store/projectStore";

const SideBarButton = ({ title, id, description, statuses, index }: ProjectProps) => {
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
    <div className="flex items-center justify-between gap-4 bg-zinc-900/50" data-testid="sidebar-project">
      <Button
        className={`justify-start bg-zinc-900 px-2 flex-1 w-28 ${selectedProject?.id === id && "bg-white text-black"}`}
        variant="ghost"
        onClick={() => setSelectedProject({ title, id, description, statuses })}
        data-testid={`select-project-${index}`}
      >
        <span className="truncate">{title}</span>
      </Button>
      <div className="flex gap-1">
        <Button
          className="hover:bg-white hover:text-black p-3"
          onClick={openUpdateProjectModal}
          data-testid={`open-update-project-modal-${index}`}
        >
          <Edit className="h-2 w-2" />
        </Button>
        <Button
          className="text-red-500 hover:bg-red-800 hover:text-red-100 p-3"
          onClick={openDeleteProjectModal}
          data-testid={`open-delete-project-modal-${index}`}
        >
          <Trash className="h-2 w-2" />
        </Button>
      </div>
    </div>
  );
};

export default SideBarButton;
