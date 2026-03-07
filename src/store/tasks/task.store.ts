import { create } from "zustand";
import { apiFetch } from "@/utils/apiClient";
import useProjectStore from "../projects/project.store";
import useAuthStore from "../auth/auth.store";
import useModalStore from "../modal/modal.store";
import { CreateTaskInput, Manipulations, TaskProps, UpdateTaskInput } from "./type";

interface Implementation {
  getAll: (projectId: string, signal: AbortSignal) => Promise<{ tasks: TaskProps[] }>;
  addTask: (task: CreateTaskInput) => Promise<{ tasks: TaskProps[] }>;
  updateTask: (task: UpdateTaskInput, manipulations: Manipulations) => Promise<{ tasks: TaskProps[] }>;
  deleteTask: (id: string) => Promise<Response>;
}

interface TaskState {
  allTasks: Record<string, TaskProps[]>; //cached tasks
  projectTasks: TaskProps[]; // current project tasks
  grabbedTaskID: string | null;
  loadingTasks: boolean;
  impl: Implementation;

  setAllTasks: (tasks: Record<string, TaskProps[]>) => void;
  setProjectTasks: (tasks: TaskProps[]) => void;
  setGrabbedTaskID: (taskID: string | null) => void;
  setLoadingTasks: (loading: boolean) => void;
  setImplementation: (implementation: Implementation) => void;

  createTask: (data: CreateTaskInput) => Promise<void>;
  updateTask: (data: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchTasks: (signal: AbortSignal) => Promise<void>;

  clearAll: () => void;
}

const apiImpl: Implementation = {
  getAll: async (projectId: string, signal: AbortSignal) => {
    return await apiFetch("/read_project_tasks", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ project_id: projectId }),
      signal,
    });
  },
  addTask: async (task) => {
    return await apiFetch("/create_task", {
      method: "POST",
      body: JSON.stringify(task),
    });
  },
  updateTask: async (task, manipulations) => {
    return await apiFetch("/update_task", {
      method: "PUT",
      body: JSON.stringify({ ...task, ...manipulations }),
    });
  },
  deleteTask: async (id) => apiFetch("/delete_task", { method: "DELETE", body: JSON.stringify({ id }) }),
};

const localImpl: Implementation = {
  getAll: async () => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    return { tasks };
  },
  addTask: async (task) => {
    const tasks: TaskProps[] = JSON.parse(localStorage.getItem("tasks") || "[]");
    const newTask = {
      ...task,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return { tasks };
  },
  updateTask: async (task, manipulations) => {
    const tasks: TaskProps[] = JSON.parse(localStorage.getItem("tasks") || "[]");
    const { toDelete, toUpdate, toAdd } = manipulations;
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      if (toDelete && toDelete.length > 0 && tasks[index].subtasks) {
        for (let i = 0; i < toDelete.length; i++) {
          tasks[index].subtasks = tasks[index].subtasks.filter((s) => s.id !== toDelete[i]);
        }
      }
      if (toAdd && toAdd.length > 0 && tasks[index].subtasks) {
        for (let i = 0; i < toAdd.length; i++) {
          tasks[index].subtasks.push({
            id: toAdd[i].id,
            text: toAdd[i].text,
            completed: toAdd[i].completed,
          });
        }
      }
      if (toUpdate && toUpdate.length > 0 && tasks[index].subtasks) {
        for (let i = 0; i < toUpdate.length; i++) {
          const subtaskIndex = tasks[index].subtasks.findIndex((s) => s.id === toUpdate[i].id);
          if (subtaskIndex !== -1) {
            tasks[index].subtasks[subtaskIndex] = {
              id: toUpdate[i].id,
              text: toUpdate[i].text,
              completed: toUpdate[i].completed,
            };
          }
        }
      }

      tasks[index] = {
        ...tasks[index],
        title: task.title!,
        statusID: task.statusID!,
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    return { tasks };
  },
  deleteTask: async (id) => {
    let tasks: TaskProps[] = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks = tasks.filter((t) => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return {} as Response;
  },
};

useAuthStore.subscribe((state) => {
  if (state.isAuthenticated) {
    useTaskStore.getState().setImplementation(apiImpl);
  } else {
    useTaskStore.getState().setImplementation(localImpl);
  }
});

useAuthStore.subscribe((state) => {
  if (!state.user) {
    useTaskStore.getState().clearAll();
  }
});

const useTaskStore = create<TaskState>()((set, get) => ({
  allTasks: {},
  projectTasks: [],
  grabbedTaskID: null,
  loadingTasks: false,
  impl: localImpl,

  setAllTasks: (tasks) => set(() => ({ allTasks: tasks })),
  setProjectTasks: (tasks) => set(() => ({ projectTasks: tasks })),
  setGrabbedTaskID: (taskID) => set(() => ({ grabbedTaskID: taskID })),
  setLoadingTasks: (loading) => set(() => ({ loadingTasks: loading })),
  setImplementation: (implementation) => set({ impl: implementation }),

  createTask: async (data: CreateTaskInput) => {
    const { impl } = get();
    const projectId = useProjectStore.getState().selectedProjectID;
    if (!projectId) return;
    set({ loadingTasks: true });

    const task: CreateTaskInput = {
      ...data,
      project_id: projectId,
    };

    const response = await impl.addTask(task);

    if (response) {
      set({
        allTasks: {
          ...get().allTasks,
          [projectId]: response.tasks,
        },
        projectTasks: response.tasks,
      });
    }

    useModalStore.getState().clearContext();

    set({ loadingTasks: false });
  },
  updateTask: async (data: UpdateTaskInput) => {
    const { impl } = get();
    const projectId = useProjectStore.getState().selectedProjectID;

    if (!projectId) return;
    set({ loadingTasks: true });

    const manipulations: Manipulations = {
      toDelete: data.subtasks?.filter((s) => s._delete).map((s) => s.id) || [],
      toUpdate: data.subtasks?.filter((s) => s._dirty) || [],
      toAdd: data.subtasks?.filter((s) => s._new) || [],
    };

    const task: UpdateTaskInput = {
      id: useModalStore.getState().currentTaskId!,
      project_id: projectId,
      ...data,
      subtasks: data.subtasks?.filter((s) => !s._new && !s._delete && !s._dirty) || [],
    };

    const response = await impl.updateTask(task, manipulations);

    if (response) {
      set({
        allTasks: {
          ...get().allTasks,
          [projectId]: response.tasks,
        },
        projectTasks: response.tasks,
      });
    }

    useModalStore.getState().clearContext();
    set({ loadingTasks: false });
  },

  deleteTask: async (id: string) => {
    const { impl } = get();
    set({ loadingTasks: true });

    const response = await impl.deleteTask(id);

    if (response) {
      const projectId = useProjectStore.getState().selectedProjectID!;

      const filteredTasks = (projectId: string) => get().allTasks[projectId].filter((t) => t.id !== id);

      const { [id]: removed, ...newTasks } = get().allTasks;
      set({
        allTasks: {
          ...newTasks,
          [projectId]: filteredTasks(projectId),
        },
        projectTasks: filteredTasks(projectId),
      });
    }

    useModalStore.getState().clearContext();
    set({ loadingTasks: false });
  },

  fetchTasks: async (signal: AbortSignal) => {
    const { impl } = get();
    const projectId = useProjectStore.getState().selectedProjectID;
    if (!projectId) return;

    if (Object.keys(get().allTasks).includes(projectId)) {
      set({ projectTasks: get().allTasks[projectId] || [] });
      return;
    }

    set({ loadingTasks: true });

    try {
      const result = await impl.getAll(projectId, signal);

      let newTasks: Record<string, TaskProps[]> = {};
      result.tasks.forEach((task) => {
        if (!newTasks[task.project_id]) {
          newTasks[task.project_id] = [];
        }
        newTasks[task.project_id].push(task);
      });

      set({
        projectTasks: result.tasks,
        allTasks: { ...get().allTasks, ...newTasks },
      });
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Previous request aborted");
        return;
      }
      throw err;
    }

    set({ loadingTasks: false });
  },
  clearAll: () => set({ allTasks: {}, projectTasks: [] }),
}));

export default useTaskStore;
