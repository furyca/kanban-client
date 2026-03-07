import { FormProvider, useForm } from "react-hook-form";
import { LegacyRef } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import FormHeader from "../FormSections/FormHeader";
import TitleSection from "../FormSections/TitleSection";
import SubtaskField from "../FormSections/SubtaskField";
import SelectStatusSection from "../FormSections/SelectStatusSection";
import SubmitButton from "../FormElements/SubmitButton";
import useTaskStore from "@/store/tasks/task.store";
import { CreateTaskInput } from "@/store/tasks/type";

const CreateTaskModal = () => {
  const createTask = useTaskStore((state) => state.createTask);
  const loadingTasks = useTaskStore((state) => state.loadingTasks);
  const ref = useClickOutside();
  const methods = useForm<CreateTaskInput>({
    defaultValues: { subtasks: [{ id: window.crypto.randomUUID(), text: "New Subtask", completed: false }] },
  });

  return (
    <FormProvider {...methods}>
      <form
        method="POST"
        onSubmit={methods.handleSubmit(createTask)}
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
        <SubtaskField form_type="create_task" />
        <SelectStatusSection />
        <SubmitButton id="confirm-create-task" text="Create" loading={loadingTasks} />
      </form>
    </FormProvider>
  );
};

export default CreateTaskModal;
