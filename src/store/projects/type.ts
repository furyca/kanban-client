export interface ProjectProps {
  id: string;
  title: string;
  description: string;
  created_at: string;
  statuses: StatusProps[];
}

export type CreateProjectInput = Omit<ProjectProps, "id" | "created_at"> & {
  user_id: string;
};
export type UpdateProjectInput = Omit<ProjectProps, "created_at">;
export type APIProjectInput = Omit<ProjectProps, "id" | "created_at"> & {
  projectID: string;
};

export interface StatusProps {
  id: string;
  text: string;
  project_id: string;
}

export type CreateStatusInput = {
  statuses: StatusProps[];
}
