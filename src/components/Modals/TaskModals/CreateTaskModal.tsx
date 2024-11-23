import useModalStore from "@/store/modalStore";
import sendPostReq from "@/utils/sendPostReq";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import useTaskStore from "@/store/taskStore";
import useProjectStore from "@/store/projectStore";
import { TaskInputs } from "./type";

const CreateTaskModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskInputs>();
  const { setModal } = useModalStore();
  const { setTasks } = useTaskStore();
  const { selectedProject } = useProjectStore();

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
    <form method="POST" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-sm bg-slate-500 p-8">
      <div className="flex justify-between">
        <h1 className="text-2xl">Add Task</h1>
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
          {...register("description", { maxLength: 255 })}
        />
      </section>

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
      <input type="submit" className="bg-blue-50 p-3 rounded-sm" value="Add" />
    </form>
  );
};

export default CreateTaskModal;
