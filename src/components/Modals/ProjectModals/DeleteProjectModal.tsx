import useProjectStore from "@/store/projectStore";
import useModalStore from "@/store/modalStore";
import { baseURL } from "@/utils/env";
import { Button } from "@/components/ui/button";
import useClickOutside from "@/hooks/useClickOutside";
import { LegacyRef } from "react";
import CloseButton from "../Form/Elements/CloseButton";

const DeleteProjectModal = () => {
  const { setProjects, selectedProject, setSelectedProject } = useProjectStore();
  const { setModal } = useModalStore();
  const ref = useClickOutside();

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
        setSelectedProject(null);
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
      className="flex flex-col justify-between text-center rounded-lg h-60 w-96 bg-gray-950 border border-slate-400 text-slate-200 p-8 shadow-card"
      data-testid="delete-project-modal"
      ref={ref as LegacyRef<HTMLDivElement>}
    >
      <section className="relative p-8">
        <h2 className="block font-bold text-2xl truncate">Delete Project '{selectedProject?.title}'?</h2>
        <CloseButton />
      </section>
      <div className="flex justify-between mt-auto pt-4 px-4">
        <Button className="h-14 w-24 bg-zinc-700 hover:bg-zinc-800 text-[16px] px-4" onClick={handleNoClick}>
          NO
        </Button>
        <Button
          className="h-14 w-24 bg-red-600 hover:bg-red-800 text-[16px] px-4"
          onClick={handleYesClick}
          data-testid="delete-project-confirm"
        >
          YES
        </Button>
      </div>
    </div>
  );
};

export default DeleteProjectModal;
