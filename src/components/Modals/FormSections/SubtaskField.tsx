import { Plus } from "lucide-react";
import Label from "@/components/Modals/FormElements/Label";
import SubtaskInput from "../FormElements/SubtaskInput";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CreateTaskInput, UpdateTaskInput } from "@/store/tasks/type";

const SubtaskField = ({ form_type }: { form_type: string }) => {
  const { control } = useFormContext<CreateTaskInput | UpdateTaskInput>();
  const { fields, append, remove } = useFieldArray<CreateTaskInput | UpdateTaskInput>({ name: "subtasks", control });

  const handleAppend = () => {
    append({
      id: window.crypto.randomUUID(),
      text: "",
      task_id: "",
      completed: false,
      _new: true
    });
  };  

  return (
    <section className="md:ps-10 md:pe-6 px-2 py-2">
      <Label text="Subtasks" forElement="subtasks" />
      <div id="subtasks">
        {fields.map((field, index: number) => (
          <SubtaskInput
            key={field.id}
            subtask_id={field.id}
            index={index}
            text={field.text}
            form_type={form_type}
            remove={remove}
          />
        ))}
      </div>
      <Button
        type="button"
        className="mt-4 py-3 w-full transition-all duration-300 text-slate-300 bg-zinc-900 hover:bg-zinc-950"
        onClick={handleAppend}
        data-testid={`add-subtasks-button`}
      >
        <Plus />
        Add More Subtasks
      </Button>
    </section>
  );
};

export default SubtaskField;
