import { create } from "zustand";
import { apiFetch } from "@/utils/apiClient";
import useAuthStore from "../auth/auth.store";
import useModalStore from "../modal/modal.store";
import {
  APIProjectInput,
  CreateProjectInput,
  CreateStatusInput,
  ProjectProps,
  StatusProps,
  UpdateProjectInput,
} from "./type";
import { TaskProps } from "../tasks/type";

interface Implementation {
  implementation: "api" | "local";
  getAll: (userID: string) => Promise<{ projects: ProjectProps[] }>;
  addProject: (project: CreateProjectInput) => Promise<{ project: ProjectProps }>;
  updateProject: (project: APIProjectInput) => Promise<{ project: ProjectProps }>;
  deleteProject: (id: string) => Promise<Response>;
  addStatus: (data: CreateStatusInput) => Promise<{ statuses: StatusProps[] }>;
  deleteStatus: (data: string, projectId: string) => Promise<Response>;
}

interface ProjectState {
  projects: ProjectProps[];
  selectedProjectID: string | null;
  loadingProjects: boolean;
  impl: Implementation;

  //setProjects: (projects: ProjectProps[]) => void;
  setSelectedProjectID: (newProject: string | null) => void;
  setLoadingProjects: (loading: boolean) => void;
  setImplementation: (implementation: Implementation) => void;

  createProject: (data: CreateProjectInput) => Promise<void>;
  updateProject: (data: UpdateProjectInput) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  fetchProjects: () => Promise<void>;

  addStatus: (data: CreateStatusInput) => Promise<void>;
  deleteStatus: (id: string, projectId: string) => Promise<void>;

  clearAll: () => void;
}

const apiImpl: Implementation = {
  implementation: "api",
  getAll: async (userID: string) => {
    return await apiFetch("/read_projects", {
      method: "POST",
      body: JSON.stringify({ user_id: userID }),
    });
  },
  addProject: async (data: CreateProjectInput) => {
    return await apiFetch("/create_project", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateProject: async (data: APIProjectInput) => {
    return await apiFetch("/update_project", {
      method: "PUT",
      body: JSON.stringify({ ...data }),
    });
  },
  deleteProject: async (id) => {
    return await apiFetch("/delete_project", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
  },
  addStatus: async (data: CreateStatusInput) => {
    return await apiFetch("/add_status", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  deleteStatus: async (id: string, projectId: string) => {
    return await apiFetch("/remove_status", {
      method: "DELETE",
      body: JSON.stringify({ statusID: id, projectID: projectId }),
    });
  },
};

const localImpl: Implementation = {
  implementation: "local",
  getAll: async () => {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    return { projects };
  },
  addProject: async (project) => {
    const newProject: ProjectProps = {
      ...project,
      id: crypto.randomUUID() as string,
      created_at: new Date().toISOString(),
    };
    const projects: ProjectProps[] = JSON.parse(localStorage.getItem("projects") || "[]");
    const updatedProjects = [...projects, newProject];
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    return { project: newProject };
  },
  updateProject: async (updatedProject) => {
    const projects: ProjectProps[] = JSON.parse(localStorage.getItem("projects") || "[]");
    const index = projects.findIndex((p) => p.id === updatedProject.projectID);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updatedProject };
      localStorage.setItem("projects", JSON.stringify(projects));
    }
    return { project: projects[index] };
  },
  deleteProject: async (id) => {
    let projects: ProjectProps[] = JSON.parse(localStorage.getItem("projects") || "[]");
    projects = projects.filter((p) => p.id !== id);
    localStorage.setItem("projects", JSON.stringify(projects));

    const tasks: TaskProps[] = JSON.parse(localStorage.getItem("tasks") || "[]");
    const updatedTasks = tasks.filter((t) => t.project_id !== id);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    return {} as Response;
  },
  addStatus: async (data: CreateStatusInput) => {
    const projects: ProjectProps[] = JSON.parse(localStorage.getItem("projects") || "[]");
    const projectId = useModalStore.getState().currentProjectId;
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex !== -1) {
      const newStatuses = data.statuses;
      projects[projectIndex].statuses.push(...newStatuses);
      localStorage.setItem("projects", JSON.stringify(projects));
    }
    return { statuses: data.statuses };
  },
  deleteStatus: async (id: string, projectId: string) => {
    const projects: ProjectProps[] = JSON.parse(localStorage.getItem("projects") || "[]");
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex !== -1) {
      const updatedStatuses = projects[projectIndex].statuses.filter((s) => s.id !== id);

      projects[projectIndex].statuses = updatedStatuses;
      localStorage.setItem("projects", JSON.stringify(projects));

      const tasks: TaskProps[] = JSON.parse(localStorage.getItem("tasks") || "[]");
      const updatedTasks = tasks.filter((t) => t.statusID !== id);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
    return {} as Response;
  },
};

const useProjectStore = create<ProjectState>()((set, get) => ({
  projects: [],
  selectedProjectID: null,
  loadingProjects: false,
  impl: apiImpl,

  //setProjects: (projects) => set(() => ({ projects })),
  setSelectedProjectID: (newProjectID: string | null) => set(() => ({ selectedProjectID: newProjectID })),
  setLoadingProjects: (loading: boolean) => set(() => ({ loadingProjects: loading })),
  setImplementation: (implementation) => set({ impl: implementation }),

  createProject: async (data: CreateProjectInput) => {
    const { impl } = get();
    const userID = useAuthStore.getState().user?.id;
    if (!userID && impl.implementation === "api") return;
    set({ loadingProjects: true });

    const project: CreateProjectInput = {
      ...data,
      user_id: userID!,
    };

    const response = await impl.addProject(project);

    if (response) {
      set({
        projects: [...get().projects, response.project],
      });
    }

    useModalStore.getState().clearContext();
    set({ loadingProjects: false });
  },
  updateProject: async (data: UpdateProjectInput) => {
    const { impl } = get();
    const projectId = useModalStore.getState().currentProjectId;

    if (!projectId) return;
    set({ loadingProjects: true });

    const project: APIProjectInput = {
      projectID: projectId,
      ...data,
    };

    const response = await impl.updateProject(project);

    if (response) {
      set({
        projects: get().projects.map((p) => (p.id === projectId ? response.project : p)),
      });
    }

    useModalStore.getState().clearContext();
    set({ loadingProjects: false });
  },

  deleteProject: async (id: string) => {
    const { impl } = get();
    set({ loadingProjects: true });

    const response = await impl.deleteProject(id);

    if (response) {
      set({
        projects: get().projects.filter((p) => p.id !== id),
        selectedProjectID: get().selectedProjectID === id ? null : get().selectedProjectID,
      });
    }
    useModalStore.getState().clearContext();

    set({ loadingProjects: false });
  },

  fetchProjects: async () => {
    const { impl } = get();
    const userID = useAuthStore.getState().user?.id;

    set({ loadingProjects: true });
    let selectedProjectID = get().selectedProjectID || null;

    try {
      const result = await impl.getAll(userID as string);

      set({
        projects: result.projects,
        selectedProjectID: result.projects.find((p) => p.id === selectedProjectID)?.id || null,
      });
    } catch (err) {
      console.error("Fetch projects error:", err);
    }

    set({ loadingProjects: false });
  },
  addStatus: async (data: CreateStatusInput) => {
    const { impl } = get();
    const projectId = useModalStore.getState().currentProjectId;
    if (!projectId) return;
    set({ loadingProjects: true });

    const response = await impl.addStatus(data);

    if (response) {
      const newStatuses = response.statuses;
      set({
        projects: get().projects.map((p) => {
          if (p.id === projectId) {
            return { ...p, statuses: [...p.statuses, ...newStatuses] };
          }
          return p;
        }),
      });
    }
    useModalStore.getState().clearContext();
    set({ loadingProjects: false });
  },
  deleteStatus: async (id: string) => {
    const { impl } = get();
    const projectId = get().selectedProjectID;
    if (!projectId) return;
    set({ loadingProjects: true });

    const response = await impl.deleteStatus(id, projectId);

    if (response) {
      set({
        projects: get().projects.map((p) => {
          if (p.id === projectId) {
            return { ...p, statuses: p.statuses.filter((s) => s.id !== id) };
          }
          return p;
        }),
      });

      useModalStore.getState().clearContext();
    }
    set({ loadingProjects: false });
  },
  clearAll: () => set({ projects: [], selectedProjectID: null }),
}));

useAuthStore.subscribe((state) => {
  if (state.isAuthenticated) {
    useProjectStore.getState().setImplementation(apiImpl);
  } else {
    useProjectStore.getState().setImplementation(localImpl);
  }
});
useAuthStore.subscribe((state) => {
  const implementation = useProjectStore.getState().impl.implementation;
  if (!state.user && implementation !== "local") {
    useProjectStore.getState().clearAll();
  }
});

export default useProjectStore;
