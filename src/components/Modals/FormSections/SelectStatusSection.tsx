import Label from "@/components/Modals/FormElements/Label";
import { useFormContext } from "react-hook-form";
import { useSelectedProject } from "@/store/projects/project.selectors";
import { useActiveTask } from "@/store/tasks/task.selectors";
import useModalStore from "@/store/modal/modal.store";
import { CreateTaskInput, UpdateTaskInput } from "@/store/tasks/type";

const SelectStatusSection = () => {
  const { register } = useFormContext<CreateTaskInput | UpdateTaskInput>();
  const selectedProject = useSelectedProject();
  const currentTaskStatus = useActiveTask()?.statusID;
  const currentStatusId = useModalStore((state) => state.currentStatusId);

  return (
    <section className="md:ps-10 md:pe-6 px-2 py-2">
      <Label text="Status" forElement="status" />
      <select
        id="status"
        defaultValue={currentTaskStatus || currentStatusId!}
        className="shadow-xs bg-slate-300/80 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 placeholder-gray-400 shadow-xs-light"
        {...register("statusID")}
      >
        {selectedProject?.statuses.map((status, index) => {
          return (
            <option key={index} value={status.id}>
              {status.text}
            </option>
          );
        })}
      </select>
    </section>
  );
};

export default SelectStatusSection;
