import { RegisterOptions } from "react-hook-form";
import { TaskInputs } from "./TaskModals/type";
import { ProjectInputs } from "./ProjectModals/type";

export const titleRules: RegisterOptions<TaskInputs | ProjectInputs, "title"> = {
  required: true,
  minLength: 1,
  maxLength: 40,
  validate: (value) => value.trim().length > 0,
};

export const subtaskNstatusRules: RegisterOptions<
  TaskInputs | ProjectInputs,
  `subtasks.${number}.text` | `status.${number}.text`
> = {
  required: true,
  minLength: 1,
  maxLength: 255,
  validate: (value) => value.trim().length > 0,
};

export const descRules: RegisterOptions<ProjectInputs, "description"> = {
  maxLength: 255,
};
