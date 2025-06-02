import { create } from "zustand";

export interface TaskProps {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  projectID: string;
  status: string;
  subtasks: SubTaskProps[] | null;
  index?: number; //for testing purposes
}

export interface SubTaskProps {
  subtask_id?: string;
  task_id: string;
  text: string;
  completed: boolean;
}

interface TaskState {
  tasks: TaskProps[];
  setTasks: (tasks: TaskProps[]) => void;
  activeTask: TaskProps | null;
  setActiveTask: (task: TaskProps | null) => void;
  currentTaskStatus: string | null;
  setCurrentTaskStatus: (task: string) => void;
  loadingTasks: boolean;
  setLoadingTasks: (loading: boolean) => void;
  subtaskRemovalList: string[];
  addSubtaskRemovalList: (id: string) => void;
  removeSubtaskRemovalList: (id: string) => void;
  clearSubtaskRemovalList: () => void;
}

const useTaskStore = create<TaskState>()((set) => ({
  tasks: [],
  setTasks: (tasks) => set(() => ({ tasks })),
  activeTask: null,
  setActiveTask: (task) => set(() => ({ activeTask: task })),
  currentTaskStatus: null,
  setCurrentTaskStatus: (currentStatus) => set(() => ({ currentTaskStatus: currentStatus })),
  loadingTasks: false,
  setLoadingTasks: (loading) => set(() => ({ loadingTasks: loading })),
  subtaskRemovalList: [],
  addSubtaskRemovalList: (id) => set((state) => ({ subtaskRemovalList: [...state.subtaskRemovalList, id] })),
  removeSubtaskRemovalList: (id) =>
    set((state) => ({ subtaskRemovalList: state.subtaskRemovalList.filter((subtaskId) => subtaskId !== id) })),
  clearSubtaskRemovalList: () => set(() => ({ subtaskRemovalList: [] })),
}));

export default useTaskStore;
