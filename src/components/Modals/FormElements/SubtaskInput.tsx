import { useState } from "react";
import InputInfo from "../FormElements/InputInfo";
import { useFormContext } from "react-hook-form";
import { TaskInputs } from "../TaskModals/type";
import { Button } from "@/components/ui/button";
import useTaskStore from "@/store/taskStore";

type SubtaskInputProps = {
  subtask_id: string;
  index: number;
  text: string;
  form_type: string;
  remove: (index: number) => void;
};

const MAX_LENGTH = 255;

const SubtaskInput = ({ subtask_id, index, text, form_type, remove }: SubtaskInputProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext<TaskInputs>();
  const [length, setLength] = useState<number>(text.length || 0);
  const [removed, setRemoved] = useState<boolean>(false);
  const { subtaskRemovalList, addSubtaskRemovalList, removeSubtaskRemovalList } = useTaskStore();

  const handleRemove = () => {
    setRemoved(true);
    addSubtaskRemovalList(subtask_id);
  };

  const handleUndo = () => {
    setRemoved(false);
    removeSubtaskRemovalList(subtask_id);
  };

  return (
    <div className={`"mt-0.5 text-right relative" ${removed ? "opacity-30" : ""}`}>
      <div className="flex items-center gap-2 w-full relative">
        <input
          type="checkbox"
          className="relative left-0 md:absolute checked:text-emerald-700 md:-left-7 h-5 w-5 border-2 rounded-full cursor-pointer bg-transparent focus:outline-none focus:ring-0 focus:shadow-none focus:ring-offset-0"
          data-testid={`update-project-subtask${index}.completed`}
          {...register(`subtasks.${index}.completed`)}
          disabled={removed}
        />
        <input
          className="flex-grow shadow-xs bg-slate-300/80 border border-gray-300 text-gray-900 text-base rounded-sm focus:ring-blue-900 focus:border-blue-900 w-full py-0.5 px-2 placeholder-gray-400 shadow-xs-light max-h-32"
          data-testid={`create-project-subtasks${index}`}
          {...register(`subtasks.${index}.text`, {
            maxLength: MAX_LENGTH,
            validate: (value: string) => value.trim().length > 0 || subtaskRemovalList.includes(subtask_id),
          })}
          onChange={(e) => setLength(e.target.value.length)}
          disabled={removed}
        />
      </div>
      {form_type === "create_task" ? (
        <Button
          type="button"
          variant="link"
          className="text-white text-end h-auto p-0 pb-1 px-2.5"
          onClick={() => remove(index)}
        >
          X
        </Button>
      ) : (
        <div className="w-full py-1">
          {removed ? (
            <Button
              type="button"
              variant="link"
              className="text-white underline underline-offset-2 text-end h-auto p-0 pb-1 px-2.5"
              onClick={handleUndo}
            >
              Undo
            </Button>
          ) : (
            <div className="flex items-center justify-end gap-2">
              <InputInfo
                error={errors.subtasks ? errors.subtasks[index] : undefined}
                currentLength={length}
                maxLength={MAX_LENGTH}
                message={`All subtasks must be between 1-255 characters.`}
              />
              <Button
                type="button"
                variant="link"
                className="h-6 py-1 px-2 hover:text-red-600 text-slate-300/80 underline-offset-2"
                onClick={() => handleRemove()}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubtaskInput;
