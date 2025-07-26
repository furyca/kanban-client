import { RegisterOptions } from "react-hook-form";
import { TaskInputs } from "./TaskModals/type";
import { ProjectInputs } from "./ProjectModals/type";

export const titleRules: RegisterOptions<TaskInputs | ProjectInputs, "title"> = {
  required: true,
  minLength: 1,
  maxLength: 40,
  validate: (value) => value.trim().length > 0,
};

export const statusRules: RegisterOptions<ProjectInputs, `status.${number}.text`> = {
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
