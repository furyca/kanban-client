import Label from "@/components/Modals/FormElements/Label";
import useProjectStore from "@/store/projectStore";
import useTaskStore from "@/store/taskStore";
import { useFormContext } from "react-hook-form";
import { TaskInputs } from "../TaskModals/type";

const SelectStatusSection = () => {
  const { selectedProject } = useProjectStore();
  const { currentTaskStatus } = useTaskStore();
  const { register } = useFormContext<TaskInputs>();

  return (
    <section className={`${window.innerWidth > 768 ? "ps-10 pe-6" : "px-2"} py-2`}>
      <Label text="Status" forElement="status" />
      <select
        id="status"
        defaultValue={currentTaskStatus || ""}
        className="shadow-xs bg-slate-300/80 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 placeholder-gray-400 shadow-xs-light"
        {...register("status")}
      >
        {selectedProject?.status.map((status, index) => {
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
