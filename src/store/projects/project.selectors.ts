import useProjectStore from "./project.store";

export const useProjectById = (projectId: string) => {
  const projects = useProjectStore((state) => state.projects);
  return projects.find((p) => p.id === projectId);
};

export const useProjectIds = () => {
  const projects = useProjectStore((state) => state.projects);
  return projects.map((p) => p.id);
};

export const useSelectedProject = () => {
  const projects = useProjectStore((state) => state.projects);
  const selectedProjectID = useProjectStore((state) => state.selectedProjectID);
  return projects.find((p) => p.id === selectedProjectID);
};