import useModalStore from "@/store/modalStore";
import sendPostReq from "@/utils/sendPostReq";
import { SubmitHandler, useForm } from "react-hook-form";
import useTaskStore from "@/store/taskStore";
import useProjectStore from "@/store/projectStore";
import { TaskInputs } from "./type";
import FormModal from "../Form/FormModal";

const CreateTaskModal = () => {
  const { setTasks } = useTaskStore();
  const { selectedProject } = useProjectStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TaskInputs>({ defaultValues: { subtasks: [{ text: "New Subtask" }] } });
  const { setModal } = useModalStore();

  const onSubmit: SubmitHandler<TaskInputs> = async (data) => {
    try {
      const json = await sendPostReq({
        path: "/create_task",
        opts: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ...data, project_id: selectedProject?.id }),
        },
      });

      if (json) {
        setTasks([...json.tasks]);
        setModal("none");
      }
    } catch (e: any) {
      console.error(e.message);
    }
  };

  return (
    <FormModal
      form={{
        id: "create-task-modal",
        header: "Add Task",
        title: "create-task-title",
        type: "create_task",
      }}
      field={{
        type: "subtasks",
        label: "Subtasks",
      }}
      submit={{
        id: "confirm-create-task",
        text: "Create",
      }}
      handleSubmit={handleSubmit(onSubmit)}
      method="POST"
      register={register}
      errors={errors}
      control={control}
    />
  );
};

export default CreateTaskModal;
