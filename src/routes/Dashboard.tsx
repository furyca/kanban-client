import SideBar from "@/components/SideBar";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import { baseURL } from "@/utils/env";
import useProjectStore from "@/store/projectStore";
import useTaskStore from "@/store/taskStore";
import StatusArea from "@/components/StatusArea";
import ProjectSelectionArea from "@/components/ProjectSelectionArea";

const Dashboard = () => {
  useAuth();
  const { setProjects, selectedProject } = useProjectStore();
  const { setTasks } = useTaskStore();

  // Fetch projects
  useEffect(() => {
    const getProjects = async () => {
      const response = await fetch(`${baseURL}/read_projects`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();

      json.projects && setProjects(json.projects);
    };

    getProjects();
  }, []);

  // Fetch tasks
  useEffect(() => {
    const getTasks = async () => {
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
    };

    selectedProject && getTasks();
  }, [selectedProject]);
  
  return (
    <div className="flex h-full">
      <SideBar />
      <main className="w-full relative">
        {selectedProject ? (
          <>
            <div className="sticky top-0 left-0 border-b border-slate-600 p-2 h-24">
              <h1 className="font-bold text-xl">{selectedProject?.title}</h1>
              <h3 className="italic text-xs tracking-wide max-w-96 line-clamp-3">{selectedProject?.description}</h3>
            </div>
            <StatusArea />
          </>
        ) : (
          <ProjectSelectionArea />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
