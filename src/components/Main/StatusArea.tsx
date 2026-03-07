import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { MouseEvent, useCallback, useRef, useState } from "react";
import TaskContainer from "./TaskContainer";
import { debounce } from "@/utils/debounce";
import { Button } from "../ui/button";
import useModalStore from "@/store/modal/modal.store";
import { apiFetch } from "@/utils/apiClient";
import { useSelectedProject } from "@/store/projects/project.selectors";
import useTaskStore from "@/store/tasks/task.store";
import { useGrabbedTask } from "@/store/tasks/task.selectors";
import { TaskProps } from "@/store/tasks/type";
import useProjectStore from "@/store/projects/project.store";

const StatusArea = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingTaskUpdatesRef = useRef<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isTaskDragging, setIsTaskDragging] = useState(false);
  const [lockUI, setLockUI] = useState(false);
  const selectedProject = useSelectedProject();
  const setModal = useModalStore((s) => s.setModal);
  const setCurrentProjectID = useModalStore((s) => s.setCurrentProjectId);
  const selectedProjectID = useProjectStore((s) => s.selectedProjectID);
  const grabbedTaskID = useTaskStore((s) => s.grabbedTaskID);
  const setGrabbedTaskID = useTaskStore((s) => s.setGrabbedTaskID);
  const grabbedTask = useGrabbedTask();
  const setProjectTasks = useTaskStore((s) => s.setProjectTasks);
  const projectTasks = useTaskStore((s) => s.projectTasks);
  const setAllTasks = useTaskStore((s) => s.setAllTasks);
  const allTasks = useTaskStore((s) => s.allTasks);
  const rollbackSnapshotRef = useRef<TaskProps[] | null>(null);
  const impl = useProjectStore((s) => s.impl);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1 },
    }),
  );

  /* ---------------- side scroll during drag ---------------- */

  const SCROLL_SPEED = 10;

  const handleDragMove = (event: DragMoveEvent) => {
    if (!isTaskDragging || !containerRef.current) return;

    const { left, right } = containerRef.current.getBoundingClientRect();
    const edgeThreshold = 50;

    if (event.delta.x < left + edgeThreshold) {
      containerRef.current.scrollLeft -= SCROLL_SPEED;
    } else if (event.delta.x > right - edgeThreshold) {
      containerRef.current.scrollLeft += SCROLL_SPEED;
    }
  };

  /* ---------------- grab & scroll ---------------- */

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (isTaskDragging || !containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || grabbedTaskID || !containerRef.current) return;
    const walk = e.pageX - startX;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => setIsDragging(false);

  /* ---------------- debounced submit ---------------- */

  const debouncedSubmit = useCallback(
    debounce(async () => {
      const updates = { ...pendingTaskUpdatesRef.current };
      if (Object.keys(updates).length === 0 || !selectedProject) return;

      setLockUI(true);
      pendingTaskUpdatesRef.current = {};

      try {
        await apiFetch("/bulk_update_tasks", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            updates,
            project_id: selectedProject.id,
          }),
        });
      } catch {
        setProjectTasks(rollbackSnapshotRef.current!);
      } finally {
        rollbackSnapshotRef.current = null;
        setLockUI(false);
      }
    }, 1000),
    [selectedProject?.id],
  );

  /* ---------------- drag handlers ---------------- */

  const handleDragStart = (event: DragStartEvent) => {
    if (lockUI) return;
    setIsTaskDragging(true);
    setGrabbedTaskID(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!rollbackSnapshotRef.current) {
      rollbackSnapshotRef.current = structuredClone(projectTasks);
    }

    setIsTaskDragging(false);
    if (lockUI) return;

    const { over } = event;
    if (!over) {
      setGrabbedTaskID(null);
      return;
    }

    const newStatusId = over.data.current?.statusID;

    if (!grabbedTaskID || newStatusId === grabbedTask?.statusID) {
      setGrabbedTaskID(null);
      return;
    }

    // optimistic update
    if (grabbedTask && newStatusId) {
      const updatedTasks = projectTasks.map((task) =>
        task.id === grabbedTaskID ? { ...task, statusID: newStatusId } : task,
      );
      setProjectTasks(updatedTasks);
      setAllTasks({
        ...allTasks,
        [selectedProject!.id]: updatedTasks,
      });
      if (impl.implementation === "local") {
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      }
    }

    pendingTaskUpdatesRef.current[grabbedTaskID] = newStatusId;

    setGrabbedTaskID(null);
    if (impl.implementation === "api") {
      debouncedSubmit();
    }
  };

  const openAddStatusModal = () => {
    setCurrentProjectID(selectedProjectID);
    setModal("add_status");
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={window.innerWidth > 768 ? handleDragStart : undefined}
      onDragEnd={window.innerWidth > 768 ? handleDragEnd : undefined}
      onDragMove={window.innerWidth > 768 ? handleDragMove : undefined}
    >
      <div
        ref={containerRef}
        className="flex flex-row absolute left-0 right-0 overflow-y-hidden gap-1 overflow-x-auto p-1 h-[calc(100%-12px)] select-none"
        onMouseDown={window.innerWidth > 768 ? handleMouseDown : undefined}
        onMouseMove={window.innerWidth > 768 ? handleMouseMove : undefined}
        onMouseUp={window.innerWidth > 768 ? stopDragging : undefined}
        onMouseLeave={window.innerWidth > 768 ? stopDragging : undefined}
        onTouchEnd={stopDragging}
      >
        {selectedProject?.statuses?.length ? (
          selectedProject.statuses.map((status) => <TaskContainer key={status.id} text={status.text} id={status.id} />)
        ) : (
          <div className="flex flex-col items-center w-full gap-y-4 mt-4">
            <p className="font-bold">There are no status yet</p>
            <Button variant="secondary" onClick={openAddStatusModal}>
              Add status
            </Button>
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default StatusArea;
