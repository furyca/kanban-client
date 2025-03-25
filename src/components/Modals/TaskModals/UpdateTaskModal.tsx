import useModalStore from "@/store/modalStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { baseURL } from "@/utils/env";
import useProjectStore from "@/store/projectStore";
import useTaskStore from "@/store/taskStore";
import { TaskInputs } from "./type";
import FormModal from "../Form/FormModal";

const UpdateTaskModal = () => {
  const { activeTask, setTasks, setActiveTask } = useTaskStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TaskInputs>({
    defaultValues: {
      subtasks: activeTask?.subtasks || [],
    },
  });
  const { setModal } = useModalStore();
  const { selectedProject } = useProjectStore();

  const onSubmit: SubmitHandler<TaskInputs> = async (data) => {
    if (data.subtasks) {
      data.subtasks.forEach((subtask) => {
        if (!subtask.hasOwnProperty("task_id")) {
          subtask.task_id = activeTask?.id as string;
        }
      });
    }

    try {
      const response = await fetch(`${baseURL}/update_task`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: activeTask?.id,
          project_id: selectedProject?.id,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      if (json) {
        setTasks(json.tasks);
        setModal("none");
        setActiveTask(null);
      }
    } catch (e: any) {
      console.error(e.message);
    }
  };
  return (
    <FormModal
      form={{
        id: "update-task-modal",
        header: "Edit Task",
        title: "update-task-title",
        type: "update_task",
      }}
      field={{
        type: "subtasks",
        label: "Subtasks",
      }}
      submit={{
        id: "update-task-confirm",
        text: "Save",
      }}
      handleSubmit={handleSubmit(onSubmit)}
      method="PUT"
      control={control}
      register={register}
      errors={errors}
    />
  );
};

export default UpdateTaskModal;
