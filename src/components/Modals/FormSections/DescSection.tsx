import Label from "@/components/Modals/FormElements/Label";
import { useState } from "react";
import { descRules } from "../formRules";
import InputInfo from "../FormElements/InputInfo";
import { useForm } from "react-hook-form";
import { ProjectInputs } from "../ProjectModals/type";

const DescSection = () => {
  const [length, setLength] = useState<number>(0);
  const {
    register,
    formState: { errors },
  } = useForm<ProjectInputs>();

  return (
    <section className={`${window.innerWidth > 768 ? "ps-10 pe-6" : "px-2"} py-2`}>
      <Label text="Description" forElement="create-project-description" />
      <textarea
        id="create-project-description"
        className="resize-none h-24 shadow-xs bg-slate-300/80 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-500 shadow-xs-light"
        placeholder="Type a description"
        data-testid="create-project-desc"
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
