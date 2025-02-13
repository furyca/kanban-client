import { create } from "zustand";

export interface ProjectProps {
  id: string;
  title: string;
  description: string;
  created_at?: string;
  statuses: string[];
  index?: number;
}

interface ProjectState {
  projects: ProjectProps[];
  selectedProject: ProjectProps | null;
  setProjects: (projects: ProjectProps[]) => void;
  setSelectedProject: (newProject: ProjectProps | null) => void;
}

const useProjectStore = create<ProjectState>()((set) => ({
  projects: [],
  setProjects: (projects) => set(() => ({ projects })),
  selectedProject: null,
  setSelectedProject: (newProject: ProjectProps | null) => set(() => ({ selectedProject: newProject })),
}));

export default useProjectStore;
