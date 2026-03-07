import ProjectSelectionArea from "@/components/Main/ProjectSelectionArea";
import ProjectSummary from "@/components/Main/ProjectSummary";
import StatusArea from "@/components/Main/StatusArea";
import SideBar from "@/components/SideBar/SideBar";
import useAuthStore from "@/store/auth/auth.store";
import useProjectStore from "@/store/projects/project.store";
import useTaskStore from "@/store/tasks/task.store";
import { useEffect } from "react";

const Demo = () => {
  const selectedProjectID = useProjectStore((s) => s.selectedProjectID);
  const fetchProjects = useProjectStore((s) => s.fetchProjects);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const { isAuthChecked } = useAuthStore();

  useEffect(() => {
    isAuthChecked && fetchProjects();
  }, [isAuthChecked]);

  useEffect(() => {
    const signal: AbortSignal = new AbortController().signal;
    selectedProjectID && fetchTasks(signal);
  }, [selectedProjectID, fetchTasks]);

  return (
    <div className="flex flex-grow h-full">
      <SideBar />
      <main className="w-full flex flex-col flex-grow">
        {selectedProjectID ? (
          <>
            <ProjectSummary />
            <div className="relative grid grid-rows-[auto,1fr] w-full flex-grow">
              <StatusArea />
            </div>
          </>
        ) : (
          <ProjectSelectionArea />
        )}
      </main>
    </div>
  );
};

export default Demo;
