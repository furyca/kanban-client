import { Plus } from "lucide-react";
import Label from "@/components/Modals/FormElements/Label";
import SubtaskInput from "../FormElements/SubtaskInput";
import { useFieldArray, useFormContext } from "react-hook-form";
import { TaskInputs } from "../TaskModals/type";
import { Button } from "@/components/ui/button";

const SubtaskField = () => {
  const { control } = useFormContext<TaskInputs>();
  const { fields, append } = useFieldArray<TaskInputs>({ name: "subtasks", control });

  const handleAppend = () => {
    append({
      text: "",
      task_id: "",
      completed: false,
    });
  };  

  return (
    <section className="md:ps-10 md:pe-6 px-2 py-2">
      <Label text="Subtasks" forElement="subtasks" />
      <div id="subtasks">
        {fields.map((field, index: number) => (
          <SubtaskInput key={field.id} id={field.subtask_id} index={index} text={field.text} />
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
