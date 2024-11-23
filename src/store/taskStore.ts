import { create } from "zustand";

export interface TaskProps {
  id: string;
  title: string;
  description: string;
  created_at: string;
  projectID: string;
  status: string;
}

interface TaskState {
  tasks: TaskProps[];
  setTasks: (tasks: TaskProps[]) => void;
  activeTask: TaskProps | null;
  setActiveTask: (task: TaskProps) => void;
}

const useTaskStore = create<TaskState>()((set) => ({
  tasks: [],
  setTasks: (tasks) => set(() => ({ tasks })),
  activeTask: null,
  setActiveTask: (task) => set(() => ({ activeTask: task })),
}));

export default useTaskStore;
