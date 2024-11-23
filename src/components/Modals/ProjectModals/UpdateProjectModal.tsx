import useModalStore from "@/store/modalStore";
import useProjectStore, { ProjectProps } from "@/store/projectStore";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { baseURL } from "@/utils/env";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectInputs } from "./type";

const UpdateProjectModal = () => {
  const { setProjects, setSelectedProject, selectedProject } = useProjectStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProjectInputs>({
    defaultValues: {
      statuses: selectedProject?.statuses,
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "statuses" as never, //re-check later
    control,
  });
  const { setModal } = useModalStore();

  const onSubmit: SubmitHandler<ProjectInputs> = async (data) => {
    try {
      const response = await fetch(`${baseURL}/update_project`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: selectedProject?.id,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      if (json) {
        setSelectedProject(json.projects.find((project: ProjectProps) => project.id === json.selectedProjectID));
        setProjects([...json.projects]);
        setModal("none");
      }
    } catch (e: any) {
      console.error(e.message);
    }
  };
  return (
    <form method="PUT" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-sm bg-slate-500 p-8">
      <div className="flex justify-between">
        <h1 className="text-2xl">Edit Project</h1>
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
          defaultValue={selectedProject?.title}
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
          defaultValue={selectedProject?.description}
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

export default UpdateProjectModal;
