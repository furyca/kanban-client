import { useState } from "react";
import useProjectStore from "@/store/projectStore";
import useTaskStore from "@/store/taskStore";
import Label from "@/components/Modals/FormElements/Label";
import { titleRules } from "../formRules";
import InputInfo from "../FormElements/InputInfo";
import { TitleInputProps } from "./type";
import { FieldValues, RegisterOptions, useFormContext } from "react-hook-form";

const TitleSection = ({ id, label, message, form_type }: TitleInputProps) => {
  const [titleLength, setTitleLength] = useState<number>(0);
  const { selectedProject } = useProjectStore();
  const { activeTask } = useTaskStore();
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const defaultTitle = () => {
    switch (form_type) {
      case "create_project":
        return "New Project";
      case "update_project":
        return selectedProject?.title;
      case "create_task":
        return "New Task";
      case "update_task":
        return activeTask?.title;
      default:
        return "";
    }
  };

  return (
    <section className={`${window.innerWidth > 768 ? "ps-10 pe-6" : "px-2"} py-2`}>
      <Label text={label} forElement={id} />
      <input
        id={id}
        className="shadow-xs mb-1 bg-slate-300/80 border border-gray-300 text-gray-900 text-sm rounded-sm block w-full py-0.5 px-2 placeholder-gray-400 shadow-xs-light"
        type="text"
        placeholder="Title"
        defaultValue={defaultTitle()}
        data-testid={id}
        {...register("title", titleRules as RegisterOptions<FieldValues, "title">)}
        onChange={(e) => setTitleLength(e.target.value.length)}
      />
      <InputInfo
        error={errors?.title}
        currentLength={titleLength}
        maxLength={titleRules.maxLength as number}
        message={message}
      />
    </section>
  );
};

export default TitleSection;
