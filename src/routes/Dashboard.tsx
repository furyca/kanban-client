import { useEffect } from "react";
import { baseURL } from "@/utils/env";
import useProjectStore from "@/store/projectStore";
import useTaskStore from "@/store/taskStore";
import ProjectSelectionArea from "@/components/Main/ProjectSelectionArea";
import SideBar from "@/components/SideBar/SideBar";
import StatusArea from "@/components/Main/StatusArea";
import ProjectSummary from "@/components/Main/ProjectSummary";
import useAuthStore from "@/store/authStore";

const Dashboard = () => {
  const { setProjects, selectedProject, setLoadingProjects } = useProjectStore();
  const { setTasks, setLoadingTasks } = useTaskStore();
  const { token } = useAuthStore();

  // Fetch projects
  useEffect(() => {
    const getProjects = async () => {
      setLoadingProjects(true);
      const response = await fetch(`${baseURL}/read_projects`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();

      json.projects && setProjects(json.projects);
      setLoadingProjects(false);
    };

    getProjects();
  }, []);

  // Fetch tasks
  useEffect(() => {
    const getTasks = async () => {
      setLoadingTasks(true);
      const response = await fetch(`${baseURL}/read_tasks`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          project_id: selectedProject?.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();

      json.tasks && setTasks(json.tasks);
      setLoadingTasks(false);
    };

    selectedProject && getTasks();
  }, [selectedProject?.id]);

  return (
    <div className="flex flex-grow h-full">
      <SideBar />
      <main className="w-full flex flex-col flex-grow">
        {selectedProject ? (
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

export default Dashboard;
