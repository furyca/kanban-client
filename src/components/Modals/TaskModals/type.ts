import { SubTaskProps } from "@/store/taskStore";

export type TaskInputs = {
  title: string;
  subtasks: SubTaskProps[] | null;
  status: string;
};