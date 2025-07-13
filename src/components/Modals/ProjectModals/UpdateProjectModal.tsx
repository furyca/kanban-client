import useModalStore from "@/store/modalStore";
import useProjectStore, { ProjectProps } from "@/store/projectStore";
import { FormProvider, useForm } from "react-hook-form";
import { ProjectInputs } from "./type";
import useClickOutside from "@/hooks/useClickOutside";
import { LegacyRef, useEffect } from "react";
import FormHeader from "../FormSections/FormHeader";
import TitleSection from "../FormSections/TitleSection";
import SubmitButton from "../FormElements/SubmitButton";
import DescSection from "../FormSections/DescSection";
import StatusField from "../FormSections/StatusField";
import useFormSubmit from "@/hooks/useFormSubmit";

const UpdateProjectModal = () => {
  const { setProjects, setSelectedProject, selectedProject } = useProjectStore();
  const methods = useForm<ProjectInputs>({
    defaultValues: {
      description: selectedProject?.description,
      status: selectedProject?.status,
    },
  });
  const { onSubmit, res, loading } = useFormSubmit({
    url: "/update_project",
    method: "PUT",
    buildBody: (data) => ({
      id: selectedProject?.id,
      ...data,
    }),
  });
  const ref = useClickOutside();
  const { setModal } = useModalStore();

  useEffect(() => {
    if (res?.projects) {
      setSelectedProject(res.projects.find((project: ProjectProps) => project.id === res.selectedProjectID));
      setProjects(res.projects);
      setModal("none");
    }
  }, [res?.projects]);

  return (
    <FormProvider {...methods}>
      <form
        method="PUT"
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col rounded-lg h-5/6 w-11/12 md:w-2/3 lg:w-1/2 overflow-auto bg-slate-800 border-2 border-gray-500 text-slate-400 shadow-card"
        data-testid="update-project-modal"
        ref={ref as LegacyRef<HTMLFormElement>}
      >
        <FormHeader text="Edit Project" />
        <TitleSection
          id="update-project-title"
          label="Title *"
          message="Title must be between 1-40 characters."
          form_type="update_project"
        />
        <DescSection id="update-project-description" form_type="update_project" />
        <StatusField />
        <SubmitButton id="update-project-confirm" text="Save" loading={loading} />
      </form>
    </FormProvider>
  );
};

export default UpdateProjectModal;
