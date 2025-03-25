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
  id: string;
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
}

const useTaskStore = create<TaskState>()((set) => ({
  tasks: [],
  setTasks: (tasks) => set(() => ({ tasks })),
  activeTask: null,
  setActiveTask: (task) => set(() => ({ activeTask: task })),
  currentTaskStatus: null,
  setCurrentTaskStatus: (currentStatus) => set(() => ({ currentTaskStatus: currentStatus })),
}));

export default useTaskStore;
