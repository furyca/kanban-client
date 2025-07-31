import useModalStore from "@/store/modalStore";
import useProjectStore, { ProjectProps } from "@/store/projectStore";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

interface SideBarButtonProps extends ProjectProps {
  collapsed: boolean;
}

const SideBarButton = ({ title, id, description, status, index, collapsed }: SideBarButtonProps) => {
  const { setModal } = useModalStore();
  const { selectedProject, setSelectedProject } = useProjectStore();

  const openDeleteProjectModal = () => {
    setModal("delete_project");
    setSelectedProject({ title, id, description, status });
  };

  const openUpdateProjectModal = () => {
    setModal("update_project");
    setSelectedProject({ title, id, description, status });
  };

  return (
    <div
      className={`flex items-center text-sm cursor-pointer select-none rounded-none p-0 flex-1 group hover:bg-white/10 hover:text-white ${
        selectedProject?.id === id && "bg-white/30"
      } ${collapsed ? "justify-center pe-2 mb-1" : "justify-between ps-2"}`}
      onClick={() => setSelectedProject({ title, id, description, status })}
      data-testid={`select-project-${index}`}
      title={title}
    >
      {collapsed ? (
        <span className='text-xl font-bold tracking-wider'>{title.length > 1 ? title.substring(0,2) : title[0]}</span>
      ) : (
        <span className='truncate'>{title}</span>
      )}
      {!collapsed && (
        <div className={`flex gap-1 transition-all duration-200 ease-in-out opacity-100 md:opacity-0 group-hover:opacity-100`}>
          <Button
            className="p-1 md:p-2 h-fit border-none shadow-none rounded-b-none rounded-r-none text-violet-900 bg-transparent md:text-violet-400 hover:bg-violet-600 hover:text-white"
            onClick={openUpdateProjectModal}
            data-testid={`open-update-project-modal-${index}`}
            title="Edit Project"
          >
            <Pencil2Icon />
          </Button>
          <Button
            className="p-1 md:p-2 h-fit border-none shadow-none rounded-b-none rounded-r-none text-red-900 bg-transparent md:text-red-600 hover:bg-red-800 hover:text-white"
            onClick={openDeleteProjectModal}
            data-testid={`open-delete-project-modal-${index}`}
            title="Delete Project"
          >
            <TrashIcon />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SideBarButton;
