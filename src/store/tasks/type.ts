export interface TaskProps {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  project_id: string;
  statusID: string;
  subtasks: SubTaskProps[];
}

export type CreateTaskInput = Omit<TaskProps, "id" | "created_at" | "updated_at">;
export type UpdateTaskInput = Partial<Omit<TaskProps, "updated_at">>;

export type Manipulations = {
  toDelete: string[];
  toUpdate: SubTaskProps[];
  toAdd: SubTaskProps[];
};

export interface SubTaskProps {
  id: string;
  task_id?: string;
  text: string;
  completed: boolean;
  _delete?: boolean;
  _dirty?: boolean;
  _new?: boolean;
}
