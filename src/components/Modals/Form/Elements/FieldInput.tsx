import { FieldErrors, RegisterOptions, UseFieldArrayRemove, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProjectInputs } from "../../ProjectModals/type";
import { TaskInputs } from "../../TaskModals/type";
import InputInfo from "../../InputInfo";

interface FieldInputProps {
  index: number;
  register: UseFormRegister<ProjectInputs | TaskInputs>;
  rules: RegisterOptions<ProjectInputs | TaskInputs, `status.${number}.text` | `subtasks.${number}.text`>;
  remove: UseFieldArrayRemove;
  error: FieldErrors<ProjectInputs | TaskInputs> | undefined;
  type: "status" | "subtasks";
}

const FieldInput = ({ index, register, rules, remove, error, type }: FieldInputProps) => {
  const [length, setLength] = useState<number>(0);
  return (
    <>
      <div className="flex gap-2 items-center w-full mt-2 text-right relative">
        {type === "subtasks" && (
          <input
            type="checkbox"
            className="h-7 w-7 rounded-full absolute left-1 bg-blue-700/20"
            data-testid={`update-project-subtask${index}.completed`}
            {...register(`subtasks.${index}.completed`)}
          />
        )}
        <input
          className="flex-grow shadow-xs bg-slate-300 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2 placeholder-gray-400 shadow-xs-light h-9 max-h-32 min-h-9"
          data-testid={`create-project-${type}${index}`}
          {...register(`${type}.${index}.text`, rules)}
          onChange={(e) => setLength(e.target.value.length)}
        />
        <Button className="h-6 w-6 rounded-full bg-red-700 hover:bg-red-900" onClick={() => remove(index)}>
          X
        </Button>
      </div>
      <InputInfo
        error={!!error}
        currentLength={length}
        maxLength={rules.maxLength as number}
        message={`All ${type} must be between 1-255 characters.`}
      />
    </>
  );
};

export default FieldInput;
