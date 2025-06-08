import useModalStore from "@/store/modalStore";
import { FormProvider, useForm } from "react-hook-form";
import useTaskStore from "@/store/taskStore";
import useProjectStore from "@/store/projectStore";
import { TaskInputs } from "./type";
import { LegacyRef, useEffect } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import FormHeader from "../FormSections/FormHeader";
import TitleSection from "../FormSections/TitleSection";
import SubtaskField from "../FormSections/SubtaskField";
import SelectStatusSection from "../FormSections/SelectStatusSection";
import SubmitButton from "../FormElements/SubmitButton";
import useFormSubmit from "@/hooks/useFormSubmit";

const CreateTaskModal = () => {
  const { setTasks, setActiveTask, subtaskRemovalList, clearSubtaskRemovalList } = useTaskStore();
  const { selectedProject } = useProjectStore();
  const methods = useForm<TaskInputs>({ defaultValues: { subtasks: [{ subtask_id: "1", text: "New Subtask", completed: false }] } });
  const { setModal } = useModalStore();
  const ref = useClickOutside();
  const { onSubmit, res, loading } = useFormSubmit({
    url: "/create_task",
    method: "POST",
    buildBody: (data) => ({ ...data, project_id: selectedProject?.id, removalList: subtaskRemovalList }),
  });

  useEffect(() => {
    if (res?.tasks) {
      setTasks(res.tasks);
      setActiveTask(null);
      setModal("none");
    }
  }, [res?.tasks]);

  useEffect(() => {
    clearSubtaskRemovalList();
  }, []);
  
  return (
    <FormProvider {...methods}>
      <form
        method="POST"
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col rounded-lg h-5/6 w-11/12 md:w-2/3 lg:w-1/2 overflow-auto bg-slate-800 border-2 border-gray-500 text-slate-400 shadow-card"
        data-testid="create-task-modal"
        ref={ref as LegacyRef<HTMLFormElement>}
      >
        <FormHeader text="Add Task" />
        <TitleSection
          id="create-task-title"
          label="Title *"
          message="Title must be between 1-40 characters."
          form_type="create_task"
        />
        <SubtaskField />
        <SelectStatusSection />
        <SubmitButton id="confirm-create-task" text="Create" loading={loading} />
      </form>
    </FormProvider>
  );
};

export default CreateTaskModal;
