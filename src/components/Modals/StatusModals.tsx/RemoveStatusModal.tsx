import useProjectStore, { ProjectProps } from "@/store/projectStore";
import useModalStore from "@/store/modalStore";
import { baseURL } from "@/utils/env";
import useClickOutside from "@/hooks/useClickOutside";
import { LegacyRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const RemoveStatusModal = () => {
  const [loading, setLoading] = useState(false);
  const { setProjects, selectedProject, clearStatus, currentStatus, setSelectedProject } = useProjectStore();
  const { setModal } = useModalStore();
  const ref = useClickOutside();

  const handleYesClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/remove_status`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: selectedProject?.id, status: currentStatus }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      if (json) {
        setProjects(json.projects);
        setSelectedProject(json.projects.find((project: ProjectProps) => project.id === selectedProject?.id));
        clearStatus();
        setModal("none");
      }
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNoClick = () => {
    setModal("none");
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
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          className="h-10 w-28 bg-red-600 hover:bg-red-800 text-base font-bold tracking-wide rounded-lg"
          onClick={handleYesClick}
          data-testid="delete-project-confirm"
          disabled={loading}
        >
          {loading && <LoaderCircle className="animate-spin" />}
          Yes, delete
        </Button>
      </div>
    </div>
  );
};

export default RemoveStatusModal;
