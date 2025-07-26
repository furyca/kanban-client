import { ProjectInputs } from "@/components/Modals/ProjectModals/type";
import { TaskInputs } from "@/components/Modals/TaskModals/type";
import useTaskStore from "@/store/taskStore";
import { baseURL } from "@/utils/env";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";

type BuildBodyFn = (data: TaskInputs | ProjectInputs) => any;

const useFormSubmit = ({ url, method, buildBody }: { url: string; method: string; buildBody: BuildBodyFn }) => {
  const [res, setRes] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { activeTask } = useTaskStore();

  const onSubmit: SubmitHandler<TaskInputs | ProjectInputs> = async (data) => {
    setLoading(true);
    if ("subtasks" in data && data.subtasks && url === "/update_task") {
      data.subtasks.forEach((subtask) => {
        subtask.task_id = activeTask?.id as string;
      });
    }    

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseURL}${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(buildBody(data)),
      });
      
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      json && setRes(json);
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { onSubmit, res, loading };
};

export default useFormSubmit;
