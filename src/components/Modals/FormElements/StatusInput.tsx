import { useState } from "react";
import InputInfo from "./InputInfo";
import { statusRules } from "../formRules";
import { ProjectInputs } from "../ProjectModals/type";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";

const StatusInput = ({ index, remove }: any) => {
  const {
    formState: { errors },
  } = useFormContext<ProjectInputs>();
  const { register } = useFormContext<ProjectInputs>();
  const [length, setLength] = useState<number>(0);
  return (
    <div className="mt-2 text-right relative">
      <input
        className="flex-grow shadow-xs bg-slate-300/80 border border-gray-300 text-gray-900 text-base rounded-sm focus:ring-blue-900 focus:border-blue-900 w-full p-2 placeholder-gray-400 shadow-xs-light h-10 max-h-32 min-h-9"
        data-testid={`create-project-status${index}`}
        {...register(`status.${index}.text`, statusRules)}
        onChange={(e) => setLength(e.target.value.length)}
      />
      <div className="flex items-center justify-end gap-2">
        <InputInfo
          error={errors.status ? errors.status[index] : undefined}
          currentLength={length}
          maxLength={statusRules.maxLength as number}
          message={`Status must be between 1-255 characters.`}
        />
        <Button
          type="button"
          variant="link"
          className="h-6 py-1 px-2 hover:text-red-600 text-slate-300/80 underline-offset-2"
          onClick={() => remove(index)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default StatusInput;
