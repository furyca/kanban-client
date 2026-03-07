import { useModalTaskId } from "../modal/modal.selectors";
import useTaskStore from "./task.store";

export const useActiveTask = () => {
  const activeTaskId = useModalTaskId();
  return useTaskStore((state) => state.projectTasks.find((t) => t.id === activeTaskId));
};

export const useGrabbedTask = () => {
  const grabbedTaskId = useTaskStore((s) => s.grabbedTaskID);
  return useTaskStore((state) => state.projectTasks.find((t) => t.id === grabbedTaskId));
}

export const useTaskSubtasks = (taskId: string) => {
  const task = useTaskStore((state) => state.projectTasks.find((t) => t.id === taskId));
  return task!.subtasks;
};

export const useTasksByStatus = (statusID: string) => {
  const tasks = useTaskStore((state) => state.projectTasks);
  return tasks.filter((t) => t.statusID === statusID);
};
