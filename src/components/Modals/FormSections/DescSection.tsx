import Label from "@/components/Modals/FormElements/Label";
import { useState } from "react";
import { descRules } from "../formRules";
import InputInfo from "../FormElements/InputInfo";
import { useFormContext } from "react-hook-form";
import { ProjectInputs } from "../ProjectModals/type";
import useProjectStore from "@/store/projectStore";
import { DescSectionProps } from "./type";

const DescSection = ({ id, form_type }: DescSectionProps) => {
  const [length, setLength] = useState<number>(0);
  const { selectedProject } = useProjectStore();
  const {
    register,
    formState: { errors },
  } = useFormContext<ProjectInputs>();
  const defaultDesc = () => {
    if (form_type === "update_project") {
      return selectedProject?.description;
    }
    return "";
  };

  return (
    <section className="md:ps-10 md:pe-6 px-2 py-2">
      <Label text="Description" forElement={id} />
      <textarea
        id={id}
        className="resize-none h-24 shadow-xs bg-slate-300/80 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-500 shadow-xs-light"
        placeholder="Type a description"
        defaultValue={defaultDesc()}
        data-testid={id}
        {...register("description", descRules)}
        onChange={(e) => setLength(e.target.value.length)}
      />
      <InputInfo
        error={errors?.description}
        currentLength={length}
        maxLength={descRules.maxLength as number}
        message="Description cannot be longer than 255 characters."
      />
    </section>
  );
};

export default DescSection;
