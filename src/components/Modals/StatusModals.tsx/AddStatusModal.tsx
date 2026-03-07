import useClickOutside from "@/hooks/useClickOutside";
import { LegacyRef } from "react";
import SubmitButton from "../FormElements/SubmitButton";
import FormHeader from "../FormSections/FormHeader";
import StatusField from "../FormSections/StatusField";
import { FormProvider, useForm } from "react-hook-form";
import { useSelectedProject } from "@/store/projects/project.selectors";
import useProjectStore from "@/store/projects/project.store";
import { CreateStatusInput } from "@/store/projects/type";

const AddStatusModal = () => {
  const ref = useClickOutside();
  const selectedProject = useSelectedProject();
  const { addStatus, loadingProjects} = useProjectStore()
  const methods = useForm<CreateStatusInput>({
    defaultValues: {
      statuses: selectedProject?.statuses,
    },
  });

  return (
    <FormProvider {...methods}>
      <form
        method="POST"
        onSubmit={methods.handleSubmit(addStatus)}
        className="flex flex-col rounded-lg h-5/6 w-11/12 md:w-2/3 lg:w-1/2 overflow-auto bg-slate-800 border-2 border-gray-500 text-slate-400 shadow-card"
        data-testid="add-status-modal"
        ref={ref as LegacyRef<HTMLFormElement>}
      >
        <FormHeader text="Add Status" />
        <StatusField />
        <SubmitButton id="add-status-confirm" text="Save" loading={loadingProjects} />
      </form>
    </FormProvider>
  );
};

export default AddStatusModal;
