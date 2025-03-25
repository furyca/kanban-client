import { StatusState } from "@/store/projectStore";

export type ProjectInputs = {
  title: string;
  description: string;
  status: StatusState[];
};