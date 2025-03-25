import Label from "@/components/Label";
import { useState } from "react";
import { descRules } from "../../formRules";
import InputInfo from "../../InputInfo";

interface DescSectionProps {
  register: any;
  error: boolean;
}

const DescSection = ({ register, error }: DescSectionProps) => {
  const [length, setLength] = useState<number>(0);

  return (
    <section className="px-6 py-4">
      <Label text="Description" forElement="create-project-description" />
      <textarea
        id="create-project-description"
        className="resize-none h-24 shadow-xs bg-slate-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-500 shadow-xs-light"
        placeholder="Type a description"
        data-testid="create-project-desc"
        {...register("description", descRules)}
        onChange={(e) => setLength(e.target.value.length)}
      />
      <InputInfo
        error={error}
        currentLength={length}
        maxLength={descRules.maxLength as number}
        message="Description cannot be longer than 255 characters."
      />
    </section>
  );
};

export default DescSection;
