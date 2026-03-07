import { FormProvider, useForm } from "react-hook-form";
import useClickOutside from "@/hooks/useClickOutside";
import { LegacyRef } from "react";
import FormHeader from "../FormSections/FormHeader";
import TitleSection from "../FormSections/TitleSection";
import SubmitButton from "../FormElements/SubmitButton";
import DescSection from "../FormSections/DescSection";
import StatusField from "../FormSections/StatusField";
import { useSelectedProject } from "@/store/projects/project.selectors";
import { UpdateProjectInput } from "@/store/projects/type";
import useProjectStore from "@/store/projects/project.store";

const UpdateProjectModal = () => {
  const selectedProject = useSelectedProject();
  const ref = useClickOutside();
  const { updateProject, loadingProjects } = useProjectStore();
  const methods = useForm<UpdateProjectInput>({
    defaultValues: {
      description: selectedProject?.description,
      statuses: selectedProject?.statuses,
    },
  });
  
  return (
    <FormProvider {...methods}>
      <form
        method="PUT"
        onSubmit={methods.handleSubmit(updateProject)}
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
        <SubmitButton id="update-project-confirm" text="Save" loading={loadingProjects} />
      </form>
    </FormProvider>
  );
};

export default UpdateProjectModal;
