import useModalStore from "@/store/modalStore";
import useProjectStore, { ProjectProps } from "@/store/projectStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { baseURL } from "@/utils/env";
import { ProjectInputs } from "./type";
import FormModal from "../Form/FormModal";

const UpdateProjectModal = () => {
  const { setProjects, setSelectedProject, selectedProject } = useProjectStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProjectInputs>({
    defaultValues: {
      status: selectedProject?.status,
    },
  });
  const { setModal } = useModalStore();

  const onSubmit: SubmitHandler<ProjectInputs> = async (data) => {
    try {
      const response = await fetch(`${baseURL}/update_project`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: selectedProject?.id,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      if (json) {
        setSelectedProject(json.projects.find((project: ProjectProps) => project.id === json.selectedProjectID));
        setProjects([...json.projects]);
        setModal("none");
      }
    } catch (e: any) {
      console.error(e.message);
    }
  };
  return (
    <FormModal
      form={{
        id: "update-project-modal",
        header: "Edit Project",
        title: "update-project-title",
        type: "update_project",
      }}
      field={{
        type: "status",
        label: "Status",
      }}
      submit={{
        id: "update-project-confirm",
        text: "Update",
      }}
      handleSubmit={handleSubmit(onSubmit)}
      method="PUT"
      control={control}
      register={register}
      errors={errors}
    />
  );
};

export default UpdateProjectModal;
