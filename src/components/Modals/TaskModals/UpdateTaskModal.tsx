import useModalStore from "@/store/modalStore";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import { baseURL } from "@/utils/env";
import useProjectStore from "@/store/projectStore";
import useTaskStore from "@/store/taskStore";
import { TaskInputs } from "./type";

const UpdateTaskModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskInputs>();
  const { setModal } = useModalStore();
  const { selectedProject } = useProjectStore();
  const { activeTask, setTasks } = useTaskStore();

  const onSubmit: SubmitHandler<TaskInputs> = async (data) => {
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
          ...data
        }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      if (json) {
        setTasks(json.tasks)
        setModal("none");
      }
    } catch (e: any) {
      console.error(e.message);
    }
  };
  return (
    <form method="PUT" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-sm bg-slate-500 p-8">
      <div className="flex justify-between">
        <h1 className="text-2xl">Edit Task</h1>
        <Button variant="destructive" onClick={() => setModal("none")}>
          X
        </Button>
      </div>
      <section>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          className="p-3 w-full rounded-sm"
          type="text"
          placeholder="Title"
          defaultValue={activeTask?.title}
          {...register("title", { required: true, minLength: 3, maxLength: 40 })}
        />
        {errors.title && <span>This field is required</span>}
      </section>
      <section>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          className="p-3 w-full rounded-sm"
          placeholder="Type a description"
          defaultValue={activeTask?.description}
          {...register("description", { maxLength: 255 })}
        />
      </section>
      {/* <section>
        <label htmlFor="status" className="block text-sm font-medium">
          Status
        </label>
        <input
          id="status"
          className="p-3 w-full rounded-sm"
          type="text"
          placeholder="Status"
          defaultValue={activeTask?.status}
          {...register("status", { required: true, minLength: 3, maxLength: 40 })}
        />
      </section> */}
      <section>
        <label htmlFor="status" className="block text-sm font-medium">
          Status
        </label>
        <select id="status" {...register("status")}>
          {selectedProject?.statuses.map((status, index) => {
            return <option key={index} value={status} >{status}</option>;
          })}
        </select>
      </section>
      <input type="submit" className="bg-blue-50 p-3 rounded-sm" value="Save" />
    </form>
  );
};

export default UpdateTaskModal;
