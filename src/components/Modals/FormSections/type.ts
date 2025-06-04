import {
  FieldArrayWithId,
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";
import { ProjectInputs } from "../ProjectModals/type";
import { TaskInputs } from "../TaskModals/type";
import { SubTaskProps } from "@/store/taskStore";
import { StatusState } from "@/store/projectStore";

export type TaskField = FieldArrayWithId<TaskInputs, "subtasks", "id">;
export type ProjectField = FieldArrayWithId<ProjectInputs, "status", "id">;
export type ErrorProp = FieldError | undefined;
export type SubtaskErrors =
  | Merge<FieldError, (Merge<FieldError, FieldErrorsImpl<SubTaskProps>> | undefined)[]>
  | undefined;
export type StatusErrors =
  | Merge<FieldError, (Merge<FieldError, FieldErrorsImpl<StatusState>> | undefined)[]>
  | undefined;
export type FormType = "create_project" | "create_task" | "update_project" | "update_task";

export type StatusFieldProps = {
  fields: ProjectField[];
  register: UseFormRegister<ProjectInputs>;
  remove: UseFieldArrayRemove;
  errors: StatusErrors;
  append: UseFieldArrayAppend<ProjectInputs>;
};

export type SubtaskFieldProps = {
  fields: TaskField[];
  register: any;
  remove: UseFieldArrayRemove;
  errors: SubtaskErrors;
  append: UseFieldArrayAppend<TaskInputs>;
};

export type TitleInputProps = {
  id: string;
  label: string;
  message: string;
  form_type: FormType;
};

export type DescSectionProps = {
  register: UseFormRegister<ProjectInputs>;
  errors: ErrorProp;
};
