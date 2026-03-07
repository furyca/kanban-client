import useModalStore from "@/store/modal/modal.store";
import useClickOutside from "@/hooks/useClickOutside";
import { LegacyRef } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelectedProject } from "@/store/projects/project.selectors";
import useProjectStore from "@/store/projects/project.store";
import { useModalStatusId } from "@/store/modal/modal.selectors";

const RemoveStatusModal = () => {
  const currentStatusID = useModalStatusId();
  const selectedProject = useSelectedProject();
  const currentStatus = selectedProject?.statuses.find((s) => s.id === currentStatusID);
  const clearContext = useModalStore((s) => s.clearContext);
  const deleteStatus = useProjectStore((s) => s.deleteStatus);
  const loadingProjects = useProjectStore((s) => s.loadingProjects);
  const ref = useClickOutside();

  const handleYesClick = async () => {   
    deleteStatus(currentStatusID!, selectedProject!.id);
  };

  const handleNoClick = () => {
    clearContext();
  };
  return (
    <div
      className="flex flex-col justify-between rounded-lg w-60 md:w-96 bg-gray-950 border border-slate-400 text-slate-200 px-2 py-4 shadow-card"
      data-testid="delete-project-modal"
      ref={ref as LegacyRef<HTMLDivElement>}
    >
      <section className="relative p-2">
        <h2 className="block font-bold text-xl truncate">Delete {currentStatus?.text}?</h2>
      </section>
      <div className="flex justify-end gap-2 mt-auto pt-4 px-4 text-center">
        <Button
          className="h-10 w-24 bg-zinc-800 hover:bg-zinc-900 text-base rounded-lg"
          onClick={handleNoClick}
          disabled={loadingProjects}
        >
          Cancel
        </Button>
        <Button
          className="h-10 w-28 bg-red-600 hover:bg-red-800 text-base font-bold tracking-wide rounded-lg"
          onClick={handleYesClick}
          data-testid="delete-project-confirm"
          disabled={loadingProjects}
        >
          {loadingProjects && <LoaderCircle className="animate-spin" />}
          Yes, delete
        </Button>
      </div>
    </div>
  );
};

export default RemoveStatusModal;
