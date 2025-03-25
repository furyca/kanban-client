import { Plus } from "lucide-react";
import { FieldArrayWithId, FieldErrors, UseFieldArrayRemove } from "react-hook-form";
import FieldInput from "../Elements/FieldInput";
import { ProjectInputs } from "../../ProjectModals/type";
import { TaskInputs } from "../../TaskModals/type";
import Label from "@/components/Label";
import { subtaskNstatusRules } from "../../formRules";
import { Button } from "@/components/ui/button";

type FieldType = FieldArrayWithId<ProjectInputs, "status", "id"> | FieldArrayWithId<TaskInputs, "subtasks", "id">

interface FieldSectionProps {
  fields: FieldType[]
  register: any;
  remove: UseFieldArrayRemove;
  error: FieldErrors<ProjectInputs | TaskInputs> | undefined;
  append: any
  type: "status" | "subtasks";
  label: "Status" | "Subtasks";
}

const FieldSection = ({ fields, register, remove, error, append, type, label }: FieldSectionProps) => {
  const handleAppend = () => {
    append({
      id: window.crypto.randomUUID(),
      text: "",
      project_id: "",
    });
  };
  return (
    <section className="px-6 py-4">
      <Label text={label} forElement={type} />
      <div id={type}>
        {fields.map((field: FieldType, index: number) => (
          <FieldInput
            key={field.id}
            index={index}
            register={register}
            rules={subtaskNstatusRules}
            remove={remove}
            error={error}
            type={type}
          />
        ))}
      </div>
      <Button
        type="button"
        className="mt-4 py-3 w-full bg-zinc-900 hover:bg-zinc-700"
        onClick={handleAppend}
        data-testid={`add-${type}-button`}
      >
        <Plus />
        Add More {label}
      </Button>
    </section>
  );
};

export default FieldSection;
