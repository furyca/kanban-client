import useTaskStore from "@/store/taskStore";
import { FormProvider, useForm } from "react-hook-form";
import { TaskInputs } from "./type";
import useModalStore from "@/store/modalStore";
import useProjectStore from "@/store/projectStore";
import useClickOutside from "@/hooks/useClickOutside";
import { LegacyRef, useEffect } from "react";
import FormHeader from "../FormSections/FormHeader";
import TitleSection from "../FormSections/TitleSection";
import SubtaskField from "../FormSections/SubtaskField";
import SelectStatusSection from "../FormSections/SelectStatusSection";
import SubmitButton from "../FormElements/SubmitButton";
import useFormSubmit from "@/hooks/useFormSubmit";

const UpdateTaskModal = () => {
  const { activeTask, setTasks, setActiveTask, subtaskRemovalList, clearSubtaskRemovalList } = useTaskStore();
  const methods = useForm<TaskInputs>({
    defaultValues: {
      subtasks: activeTask?.subtasks || [],
    },
  });
  const ref = useClickOutside();
  const { setModal } = useModalStore();
  const { selectedProject } = useProjectStore();
  const { onSubmit, res, loading } = useFormSubmit({
    url: "/update_task",
    method: "PUT",
    buildBody: (data) => ({
      id: activeTask?.id,
      project_id: selectedProject?.id,
      removalList: subtaskRemovalList,
      ...data,
    }),
  });  

  useEffect(() => {
    clearSubtaskRemovalList();
  }, []);

  useEffect(() => {
    if (res?.tasks) {
      setTasks(res.tasks);
      setActiveTask(null);
      setModal("none");
    }
  }, [res?.tasks]);

  return (
    <FormProvider {...methods}>
      <form
        method="PUT"
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col rounded-lg h-5/6 w-11/12 md:w-2/3 lg:w-1/2 overflow-auto bg-slate-800 border-2 border-gray-500 text-slate-400 shadow-card"
        data-testid="update-task-modal"
        ref={ref as LegacyRef<HTMLFormElement>}
      >
        <FormHeader text="Edit Task" />
        <TitleSection
          id="update-task-title"
          label="Title *"
          message="Title must be between 1-40 characters."
          form_type="update_task"
        />
        <SubtaskField />
        <SelectStatusSection />
        <SubmitButton id="update-task-confirm" text="Save" loading={loading} />
      </form>
    </FormProvider>
  );
};

export default UpdateTaskModal;
