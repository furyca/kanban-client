import { ChangeEvent, useRef, useState } from "react";
import InputInfo from "../FormElements/InputInfo";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CreateTaskInput, UpdateTaskInput } from "@/store/tasks/type";

type SubtaskInputProps = {
  subtask_id: string;
  index: number;
  text: string;
  form_type: string;
  remove: (index: number) => void;
};

const MAX_LENGTH = 255;

const SubtaskInput = ({ index, text, form_type, remove }: SubtaskInputProps) => {
  const {
    formState: { errors },
    register,
    setValue,
    watch,
  } = useFormContext<CreateTaskInput | UpdateTaskInput>();
  const [length, setLength] = useState<number>(text.length || 0);
  const initialInput = useRef(text);
  const isRemoved = watch(`subtasks.${index}._delete`);
  const isNew = watch(`subtasks.${index}._new`);

  const handleRemove = () => {
    setValue(`subtasks.${index}._delete`, true);
  };

  const handleUndo = () => {
    setValue(`subtasks.${index}._delete`, false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLength(e.target.value.length);
    if(!isNew){
      setValue(`subtasks.${index}._dirty`, initialInput.current !== e.target.value);
    }
  };

  return (
    <div className={`mt-0.5 text-right relative ${isRemoved ? "opacity-30" : ""}`}>
      <div className="flex items-center gap-2 w-full relative">
        <input
          type="checkbox"
          className="relative left-0 md:absolute checked:text-emerald-700 md:-left-7 h-5 w-5 border-2 rounded-full cursor-pointer bg-transparent"
          {...register(`subtasks.${index}.completed`)}
          disabled={isRemoved}
        />
        <input
          className="flex-grow shadow-xs bg-slate-300/80 border border-gray-300 text-gray-900 text-base rounded-sm w-full py-0.5 px-2"
          {...register(`subtasks.${index}.text`, {
            maxLength: MAX_LENGTH,
            validate: (value: string) => isRemoved || value.trim().length > 0,
          })}
          onChange={handleChange}
          disabled={isRemoved}
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
          {isRemoved ? (
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
                message="All subtasks must be between 1-255 characters."
              />
              <Button
                type="button"
                variant="link"
                className="h-6 py-1 px-2 hover:text-red-600 text-slate-300/80 underline-offset-2"
                onClick={handleRemove}
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
