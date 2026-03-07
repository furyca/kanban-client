import { CreateProjectInput, UpdateProjectInput } from "@/store/projects/type";
import { CreateTaskInput, UpdateTaskInput } from "@/store/tasks/type";
import { RegisterOptions } from "react-hook-form";

export type TaskInputs = CreateTaskInput | UpdateTaskInput;
export type ProjectInputs = CreateProjectInput | UpdateProjectInput;

export const titleRules: RegisterOptions<TaskInputs | ProjectInputs, "title"> = {
  required: true,
  minLength: 1,
  maxLength: 40,
  validate: (value) => value && value.trim().length > 0,
};

export const statusRules: RegisterOptions<ProjectInputs, `statuses.${number}.text`> = {
  required: true,
  minLength: 1,
  maxLength: 255,
  validate: (value) => value.trim().length > 0,
};

// export const subtaskRules: RegisterOptions<TaskInputs, `subtasks.${number}.text`> = {
//   maxLength: 255,
//   validate: subtaskValidator,
// };

export const descRules: RegisterOptions<ProjectInputs, "description"> = {
  maxLength: 255,
  validate: (value) => value.trim().length < 256,
};
