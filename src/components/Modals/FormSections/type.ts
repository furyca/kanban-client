import { CreateProjectInput, UpdateProjectInput } from "@/store/projects/type";
import { FieldArrayWithId } from "react-hook-form";

export type ProjectField = FieldArrayWithId<CreateProjectInput | UpdateProjectInput, "statuses", "id">;
export type FormType = "create_project" | "create_task" | "update_project" | "update_task";

export type TitleInputProps = {
  id: string;
  label: string;
  message: string;
  form_type: FormType;
};

export type DescSectionProps = {
  id: string;
  form_type: FormType;
};
