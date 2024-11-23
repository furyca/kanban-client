import useModalStore from "@/store/modalStore";
import useProjectStore from "@/store/projectStore";
import sendPostReq from "@/utils/sendPostReq";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectInputs } from "./type";

const CreateProjectModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProjectInputs>({
    defaultValues: {
      statuses: ["To do"]
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "statuses" as never, //check here again
    control,
  });
  const { setProjects } = useProjectStore();
  const { setModal } = useModalStore();

  const onSubmit: SubmitHandler<ProjectInputs> = async (data) => {
    try {
      const json = await sendPostReq({
        path: "/create_project",
        opts: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ...data }),
        },
      });

      if (json) {
        setProjects([...json.projects]);
        setModal("none");
      }
    } catch (e: any) {
      console.error(e.message);
    }
  };

  return (
    <form method="POST" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-sm bg-slate-500 p-8">
      <div className="flex justify-between">
        <h1 className="text-2xl">Add Project</h1>
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
      <section className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div className="flex gap-2" key={field.id}>
            <input className="w-full" {...register(`statuses.${index}`)} />
            <Button variant="destructive" onClick={() => remove(index)}>
              <Minus />
            </Button>
          </div>
        ))}
        <Button type="button" onClick={() => append("New Status")}>
          <Plus />
          Add More Status
        </Button>
      </section>

      <input type="submit" className="bg-blue-50 p-3 rounded-sm" value="Add" />
    </form>
  );
};

export default CreateProjectModal;
