import useModalStore from "@/store/modalStore";
import sendPostReq from "@/utils/sendPostReq";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import useTaskStore from "@/store/taskStore";
import useProjectStore from "@/store/projectStore";
import { TaskInputs } from "./type";
import { Minus, Plus } from "lucide-react";
import Label from "@/components/Label";

const CreateTaskModal = () => {
  const { setTasks, createTaskDefaultStatus } = useTaskStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TaskInputs>({ defaultValues: { subtasks: [{ text: "New Subtask" }], status: createTaskDefaultStatus } });
  const { setModal } = useModalStore();
  const { selectedProject } = useProjectStore();
  const { fields, append, remove } = useFieldArray({
    name: "subtasks" as never, //check here again
    control,
  });

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
    <form
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col rounded-lg h-3/4 overflow-auto bg-gray-950 border-2 border-gray-500 text-slate-200 p-8 w-11/12 md:w-2/3 lg:w-1/2 2xl:w-1/3 shadow-card"
      data-testid="create-task-modal"
    >
      {/* Header & Close Button */}
      <div className="relative">
        <h1 className="text-2xl text-center font-bold">Add Task</h1>
        <Button variant="destructive" className="h-8 w-8 p-2 absolute right-0 top-0" onClick={() => setModal("none")}>
          X
        </Button>
      </div>
      {/* Title */}
      <section className="mb-5">
        <Label text="Title" forElement="title" />
        <input
          id="title"
          className="shadow-xs bg-slate-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 shadow-xs-light"
          type="text"
          placeholder="Title"
          data-testid="create-task-title"
          {...register("title", { required: true, minLength: 3, maxLength: 40 })}
        />
        {errors.title && <span>This field is required</span>}
      </section>
      {/* Subtasks */}
      <section className="mb-5">
        <Label text="Subtasks" forElement="subtasks" />
        <div id="subtasks">
          {fields.map((field, index) => (
            <div className="mt-2 text-right" key={field.id}>
              <Button className="h-6 w-6 mb-1" variant="destructive" size="sm" onClick={() => remove(index)}>
                <Minus/>
              </Button>
              <textarea
                className="shadow-xs bg-slate-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 placeholder-gray-400 shadow-xs-light h-9 max-h-32 min-h-9"
                data-testid={`create-project-subtask${index}`}
                {...register(`subtasks.${index}.text`, { required: true, minLength: 3 })}
              />
            </div>
          ))}
          {errors.subtasks && <span>This field is required</span>}
        </div>
        <Button type="button" className="mt-2" onClick={() => append("New Subtask")} data-testid="add-subtask-button">
          <Plus />
          Add More Subtasks
        </Button>
      </section>
      {/* Status */}
      <section className="mb-5">
        <Label text="Status" forElement="status" />
        <select
          id="status"
          className="shadow-xs bg-slate-300 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 placeholder-gray-400 shadow-xs-light"
          {...register("status")}
        >
          {selectedProject?.statuses.map((status, index) => {
            return (
              <option key={index} value={status}>
                {status}
              </option>
            );
          })}
        </select>
      </section>
      {/* Submit */}
      <Button
        type="submit"
        className="bg-blue-700 hover:bg-blue-800 p-3 rounded-lg mt-auto h-11"
        data-testid="confirm-create-task"
      >
        Create Task
      </Button>
    </form>
  );
};

export default CreateTaskModal;
