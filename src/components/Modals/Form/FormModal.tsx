import { FormEventHandler, LegacyRef } from "react";
import TitleSection from "../TitleSection";
import DescSection from "./Sections/DescSection";
import FieldSection from "./Sections/FieldSection";
import SubmitButton from "../SubmitButton";
import useClickOutside from "@/hooks/useClickOutside";
import { FieldErrors, useFieldArray } from "react-hook-form";
import { ProjectInputs } from "../ProjectModals/type";
import { TaskInputs } from "../TaskModals/type";
import SelectStatusSection from "../TaskModals/SelectStatusSection";
import FormHeader from "./Sections/FormHeader";

interface FormModalProps {
  form: {
    id: string;
    header: string;
    title: string;
    type: "create_project" | "create_task" | "update_project" | "update_task";
  };
  field: {
    type: "status" | "subtasks";
    label: "Status" | "Subtasks";
  };
  submit: {
    id: string;
    text: string;
  };
  handleSubmit: FormEventHandler<HTMLFormElement>;
  method: string;
  register: any;
  errors: FieldErrors<TaskInputs | ProjectInputs>;
  control: any;
}

const FormModal = ({ form, field, submit, handleSubmit, method, register, errors, control }: FormModalProps) => {
  const ref = useClickOutside();
  const { fields, append, remove } = useFieldArray<ProjectInputs | TaskInputs>({ name: field.type, control });

  return (
    <form
      method={method}
      onSubmit={handleSubmit}
      className="flex flex-col rounded-lg h-3/4 overflow-auto bg-gray-950 border-2 border-gray-500 text-slate-200 w-11/12 md:w-2/3 lg:w-1/2 2xl:w-1/3 shadow-card"
      data-testid={form.id}
      ref={ref as LegacyRef<HTMLFormElement>}
    >
      <FormHeader text={form.header} />
      <TitleSection
        id={form.title}
        label="Title *"
        register={register}
        error={!!errors.title}
        message="Title must be between 1-40 characters."
        form_type={form.type}
      />
      {field.type === "status" && <DescSection register={register} error={!!errors} />}
      <FieldSection
        fields={fields}
        register={register}
        remove={remove}
        error={errors.status}
        append={append}
        type={field.type}
        label={field.label}
      />
      {field.type === "subtasks" && <SelectStatusSection register={register} />}
      <SubmitButton id={submit.id} text={submit.text} />
    </form>
  );
};

export default FormModal;
