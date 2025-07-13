import useModalStore from "@/store/modalStore";
import useProjectStore from "@/store/projectStore";
import { FormProvider,useForm } from "react-hook-form";
import { ProjectInputs } from "./type";
import useClickOutside from "@/hooks/useClickOutside";
import { LegacyRef, useEffect } from "react";
import FormHeader from "../FormSections/FormHeader";
import TitleSection from "../FormSections/TitleSection";
import SubmitButton from "../FormElements/SubmitButton";
import DescSection from "../FormSections/DescSection";
import StatusField from "../FormSections/StatusField";
import useFormSubmit from "@/hooks/useFormSubmit";

const CreateProjectModal = () => {
  const { setModal } = useModalStore();
  const { setProjects } = useProjectStore();
  const ref = useClickOutside();
  const { onSubmit, res, loading } = useFormSubmit({
    url: "/create_project",
    method: "POST",
    buildBody: (data) => ({ ...data }),
  });
  const methods = useForm<ProjectInputs>({
    mode: "onChange",
    defaultValues: {
      description: "",
      status: [
        {
          id: window.crypto.randomUUID(),
          text: "To do",
        },
        {
          id: window.crypto.randomUUID(),
          text: "In progress",
        },
        {
          id: window.crypto.randomUUID(),
          text: "Done",
        },
      ],
    },
  });

  useEffect(() => {
    if (res?.projects) {
      setProjects(res.projects);
      setModal("none");
    }
  }, [res?.projects]);

  return (
    <FormProvider {...methods}>
      <form
        method="POST"
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col rounded-lg h-5/6 w-11/12 md:w-2/3 lg:w-1/2 overflow-auto bg-slate-800 border-2 border-gray-500 text-slate-400 shadow-card"
        data-testid="create-project-modal"
        ref={ref as LegacyRef<HTMLFormElement>}
      >
        <FormHeader text="Add Project" />
        <TitleSection
          id="create-project-title"
          label="Title *"
          message="Title must be between 1-40 characters."
          form_type="create_project"
        />
        <DescSection id="create-project-description" form_type="create_project" />
        <StatusField />
        <SubmitButton id="confirm-create-project" text="Create" loading={loading} />
      </form>
    </FormProvider>
  );
};

export default CreateProjectModal;
