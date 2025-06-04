import useProjectStore from "@/store/projectStore";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { MouseEvent, TouchEvent, useCallback, useRef, useState } from "react";
import { baseURL } from "@/utils/env";
import useTaskStore, { TaskProps } from "@/store/taskStore";
import TaskContainer from "./TaskContainer";
import { debounce } from "@/utils/debounce";
import { Button } from "../ui/button";
import useModalStore from "@/store/modalStore";

const StatusArea = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingTaskUpdatesRef = useRef<Record<string, string>>({});
  const oldTasksRef = useRef<TaskProps[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isTaskDragging, setIsTaskDragging] = useState(false);
  const [lockUI, setLockUI] = useState(false);
  const serverError = useRef<null | string>(null);
  const { tasks, setTasks, activeTask, setActiveTask } = useTaskStore();
  const { selectedProject } = useProjectStore();
  const { setModal } = useModalStore();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  //side scroll
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

  //grab and scroll
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (isTaskDragging || !containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || activeTask || !containerRef.current) return;
    const walk = e.pageX - startX;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };
  const handleMouseUp = () => setIsDragging(false);

  //touch and scroll
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    if (!containerRef.current) return;
    setStartX(e.touches[0].clientX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.touches[0].clientX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => setIsDragging(false);

  const debouncedSubmit = useCallback(
    debounce(async () => {
      const updates = { ...pendingTaskUpdatesRef.current };
      if (Object.keys(updates).length === 0) return;

      setLockUI(true);
      pendingTaskUpdatesRef.current = {};

      const oldTasks = oldTasksRef.current;
      try {
        const res = await fetch(`${baseURL}/bulk_update_tasks`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            updates,
            project_id: selectedProject?.id,
          }),
        });

        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const json = await res.json();
        setTasks(json.tasks);
      } catch (err: any) {
        serverError.current = err.message;
        setTasks(oldTasks); // rollback
      } finally {
        setLockUI(false);
        oldTasksRef.current = [];
      }
    }, 1000),
    [selectedProject]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    setIsTaskDragging(false);
    if (lockUI) return; // lock UI if updating

    const { active, over } = event;
    if (!over || !over.data.current?.accepts.includes(active.id)) {
      setActiveTask(null);
      return;
    }

    const newStatus = over.data.current?.status;
    if (!activeTask || newStatus === activeTask.status) {
      setActiveTask(null);
      return;
    }

    const updatedTasks = tasks.map((task) => (task.id === activeTask.id ? { ...task, status: newStatus } : task));

    oldTasksRef.current = tasks; // save old tasks for rollback
    setTasks(updatedTasks);

    // accumulate updates
    pendingTaskUpdatesRef.current[activeTask.id] = newStatus;
    setActiveTask(null);
    debouncedSubmit();
  };

  const handleDragStart = (event: DragStartEvent) => {
    setIsTaskDragging(true);
    const task = tasks.find((task: TaskProps) => task.id === event.active.id) as TaskProps;
    setActiveTask(task);
  };

  return (
    <DndContext
      onDragStart={window.innerWidth > 768 ? handleDragStart : undefined}
      onDragEnd={window.innerWidth > 768 ? handleDragEnd : undefined}
      onDragMove={window.innerWidth > 768 ? handleDragMove : undefined}
    >
      <div
        ref={containerRef}
        className="flex absolute flex-row flex-grow overflow-y-hidden gap-1 overflow-x-auto p-1 w-full h-[calc(100vh-150px)] active:cursor-grabbing select-none"
        onMouseDown={window.innerWidth > 768 ? handleMouseDown : undefined}
        onMouseMove={window.innerWidth > 768 ? handleMouseMove : undefined}
        onMouseUp={window.innerWidth > 768 ? handleMouseUp : undefined}
        onMouseLeave={window.innerWidth > 768 ? handleMouseUp : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {selectedProject?.status && selectedProject?.status.length > 0 ? (
          <DndContext
            onDragStart={window.innerWidth > 768 ? handleDragStart : undefined}
            onDragEnd={window.innerWidth > 768 ? handleDragEnd : undefined}
            sensors={sensors}
          >
            {selectedProject.status.map((status, index) => {
              return <TaskContainer key={index} index={index} title={status.text} id={status.id} />;
            })}
          </DndContext>
        ) : (
          <div className="flex flex-col items-center w-full gap-y-4 mt-4">
            <p className="font-bold">There are no status yet</p>
            <Button variant="secondary" onClick={() => setModal("add_status")}>
              Add status
            </Button>
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default StatusArea;
