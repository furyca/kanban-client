import { useState } from "react";
import { titleRules } from "./formRules";
import Label from "../Label";
import InputInfo from "./InputInfo";
import useProjectStore from "@/store/projectStore";
import useTaskStore from "@/store/taskStore";

interface TitleInputProps {
  id: string;
  register: any;
  label: string;
  error: boolean;
  message: string;
  form_type: "create_project" | "create_task" | "update_project" | "update_task";
}

const TitleSection = ({ id, register, label, error, message, form_type }: TitleInputProps) => {
  const [titleLength, setTitleLength] = useState<number>(0);
  const { selectedProject } = useProjectStore();
  const { activeTask } = useTaskStore();
  const defaultTitle =
  form_type === "update_project" ? selectedProject?.title : form_type === "update_task" ? activeTask?.title : null;

  return (
    <section className="px-6 py-4">
      <Label text={label} forElement={id} />
      <input
        id={id}
        className="shadow-xs bg-slate-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400 shadow-xs-light"
        type="text"
        placeholder="Title"
        autoFocus
        defaultValue={defaultTitle}
        data-testid={id}
        {...register("title", titleRules)}
        onChange={(e) => setTitleLength(e.target.value.length)}
      />
      <InputInfo
        error={error}
        currentLength={titleLength}
        maxLength={titleRules.maxLength as number}
        message={message}
      />
    </section>
  );
};

export default TitleSection;
