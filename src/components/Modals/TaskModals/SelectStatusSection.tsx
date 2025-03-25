import Label from "@/components/Label";
import useProjectStore from "@/store/projectStore";
import useTaskStore from "@/store/taskStore";

const SelectStatusSection = ({ register }: any) => {
  const { selectedProject } = useProjectStore();
  const { currentTaskStatus } = useTaskStore();

  return (
    <section className="px-6 py-4">
      <Label text="Status" forElement="status" />
      <select
        id="status"
        defaultValue={currentTaskStatus || ""}
        className="shadow-xs bg-slate-300 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5 placeholder-gray-400 shadow-xs-light"
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
