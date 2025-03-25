import useModalStore from "@/store/modalStore";
import useProjectStore from "@/store/projectStore";
import sendPostReq from "@/utils/sendPostReq";
import { SubmitHandler, useForm } from "react-hook-form";
import { ProjectInputs } from "./type";
import FormModal from "../Form/FormModal";

const CreateProjectModal = () => {
  const { setModal } = useModalStore();
  const { setProjects } = useProjectStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProjectInputs>({
    defaultValues: {
      status: [
        {
          id: window.crypto.randomUUID(),
          text: "To do",
        },
        {
          id: window.crypto.randomUUID(),
          text: "In progress",
        },
        {
          id: window.crypto.randomUUID(),
          text: "Done",
        },
      ],
    },
  });

  const onSubmit: SubmitHandler<ProjectInputs> = async (data) => {
    try {
      const json = await sendPostReq({
        path: "/create_project",
        opts: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ...data }),
        },
      });

      if (json) {
        setProjects([...json.projects]);
        setModal("none");
      }
    } catch (e: any) {
      console.error(e.message);
    }
  };

  return (
    <FormModal
      form={{
        id: "create-project-modal",
        header: "Add Project",
        title: "create-project-title",
        type: "create_project",
      }}
      field={{
        type: "status",
        label: "Status",
      }}
      submit={{
        id: "create-project-confirm",
        text: "Create",
      }}
      handleSubmit={handleSubmit(onSubmit)}
      method="POST"
      control={control}
      register={register}
      errors={errors}
    />
  );
};

export default CreateProjectModal;
