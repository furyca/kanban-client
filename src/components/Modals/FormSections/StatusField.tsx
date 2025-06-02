import Label from "@/components/Modals/FormElements/Label";
import { Plus } from "lucide-react";
import StatusInput from "../FormElements/StatusInput";
import { ProjectField } from "./type";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ProjectInputs } from "../ProjectModals/type";
import { Button } from "@/components/ui/button";

const StatusField = () => {
  const { control } = useFormContext<ProjectInputs>();
  const { fields, append, remove } = useFieldArray<ProjectInputs>({ name: "status", control });

  const handleAppend = () => {
    append({
      id: window.crypto.randomUUID(),
      text: "",
      project_id: "",
    });
  };
  return (
    <section className={`${window.innerWidth > 768 ? "ps-10 pe-6" : "px-2"} py-2`}>
      <Label text="Status" forElement="status" />
      <div id="status">
        {fields.map((field: ProjectField, index: number) => (
          <StatusInput key={field.id} index={index} remove={remove} />
        ))}
      </div>
      <Button
        type="button"
        className="mt-4 py-3 w-full transition-all duration-300 text-slate-300 bg-zinc-900 hover:bg-zinc-950"
        onClick={handleAppend}
        data-testid={`add-status-button`}
      >
        <Plus />
        Add More Status
      </Button>
    </section>
  );
};

export default StatusField;
