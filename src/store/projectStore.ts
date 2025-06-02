import { create } from "zustand";

export interface ProjectProps {
  id: string;
  title: string;
  description: string;
  created_at?: string;
  status: StatusState[];
  index?: number;
}

export interface StatusState {
  id: string;
  text: string;
  project_id: string;
}

interface ProjectState {
  projects: ProjectProps[];
  selectedProject: ProjectProps | null;
  setProjects: (projects: ProjectProps[]) => void;
  setSelectedProject: (newProject: ProjectProps | null) => void;
  loadingProjects: boolean;
  setLoadingProjects: (loading: boolean) => void;
  currentStatus: StatusState | null;
  setCurrentStatus: (status: StatusState) => void;
  clearStatus: () => void;
}

const useProjectStore = create<ProjectState>()((set) => ({
  projects: [],
  setProjects: (projects) => set(() => ({ projects })),
  selectedProject: null,
  setSelectedProject: (newProject: ProjectProps | null) => set(() => ({ selectedProject: newProject })),
  loadingProjects: false,
  setLoadingProjects: (loading: boolean) => set(() => ({ loadingProjects: loading })),
  currentStatus: null,
  setCurrentStatus: (status: StatusState) => set(() => ({ currentStatus: status })),
  clearStatus: () => set(() => ({ currentStatus: null })),
}));

export default useProjectStore;
