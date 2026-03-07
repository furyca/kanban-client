import { FormProvider, useForm } from "react-hook-form";
import useClickOutside from "@/hooks/useClickOutside";
import { LegacyRef } from "react";
import FormHeader from "../FormSections/FormHeader";
import TitleSection from "../FormSections/TitleSection";
import SubtaskField from "../FormSections/SubtaskField";
import SelectStatusSection from "../FormSections/SelectStatusSection";
import SubmitButton from "../FormElements/SubmitButton";
import { useActiveTask } from "@/store/tasks/task.selectors";
import { UpdateTaskInput } from "@/store/tasks/type";
import useTaskStore from "@/store/tasks/task.store";

const UpdateTaskModal = () => {
  const activeTask = useActiveTask();
  const ref = useClickOutside();
  const updateTask = useTaskStore((state) => state.updateTask);
  const loadingTasks = useTaskStore((state) => state.loadingTasks);
  const methods = useForm<UpdateTaskInput>({
    defaultValues: {
      subtasks: activeTask?.subtasks || [],
    },
  });

  return (
    <FormProvider {...methods}>
      <form
        method="PUT"
        onSubmit={methods.handleSubmit(updateTask)}
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
        <SubtaskField form_type="update_task" />
        <SelectStatusSection />
        <SubmitButton id="update-task-confirm" text="Save" loading={loadingTasks} />
      </form>
    </FormProvider>
  );
};

export default UpdateTaskModal;
