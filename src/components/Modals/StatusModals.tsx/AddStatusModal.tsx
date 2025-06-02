import useModalStore from "@/store/modalStore";
import useClickOutside from "@/hooks/useClickOutside";
import { LegacyRef, useEffect } from "react";
import SubmitButton from "../FormElements/SubmitButton";
import FormHeader from "../FormSections/FormHeader";
import StatusField from "../FormSections/StatusField";
import { FormProvider, useForm } from "react-hook-form";
import useProjectStore, { ProjectProps } from "@/store/projectStore";
import { ProjectInputs } from "../ProjectModals/type";
import useFormSubmit from "@/hooks/useFormSubmit";

const AddStatusModal = () => {
  const ref = useClickOutside();
  const { setSelectedProject, selectedProject, setProjects } = useProjectStore();
  const { setModal } = useModalStore();

  const methods = useForm<ProjectInputs>({
    defaultValues: {
      status: selectedProject?.status,
    },
  });
  const { onSubmit, res, loading } = useFormSubmit({
    url: "/add_status",
    method: "POST",
    buildBody: (data) => ({
      id: selectedProject?.id,
      ...data,
    }),
  });

  useEffect(() => {
    if (res?.projects) {
      setProjects(res.projects);
      setModal("none");
      setSelectedProject(res.projects.find((project: ProjectProps) => project.id === selectedProject?.id));
    }
  }, [res?.projects]);

  return (
    <FormProvider {...methods}>
      <form
        method="PUT"
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col rounded-lg h-5/6 w-11/12 md:w-2/3 lg:w-1/2 overflow-auto bg-slate-800 border-2 border-gray-500 text-slate-400 shadow-card"
        data-testid="add-status-modal"
        ref={ref as LegacyRef<HTMLFormElement>}
      >
        <FormHeader text="Add Status" />
        <StatusField />
        <SubmitButton id="add-status-confirm" text="Save" loading={loading} />
      </form>
    </FormProvider>
  );
};

export default AddStatusModal;
