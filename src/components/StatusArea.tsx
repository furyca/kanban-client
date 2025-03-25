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
import { MouseEvent, TouchEvent, useRef, useState } from "react";
import TaskContainer from "./TaskContainer";
import { Button } from "./ui/button";
import { baseURL } from "@/utils/env";
import useTaskStore, { TaskProps } from "@/store/taskStore";

const StatusArea = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isTaskDragging, setIsTaskDragging] = useState(false);
  const { tasks, setTasks, activeTask, setActiveTask } = useTaskStore();
  const { selectedProject } = useProjectStore();
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

    const walk = (e.pageX - startX);
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
    e.preventDefault(); // Prevent scrolling while dragging
    if (!isDragging || !containerRef.current) return;
    const x = e.touches[0].clientX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };
  
  const handleTouchEnd = () => setIsDragging(false);

  // Dnd-kit event handlers
  // Task status change event
  async function handleDragEnd(event: DragEndEvent) {
    setIsTaskDragging(false);
    const { active, over } = event;

    // update task status
    if (over && over.data.current?.accepts.includes(active.id) && over.data.current?.status !== activeTask?.status) {
      try {
        const response = await fetch(`${baseURL}/update_task`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: activeTask?.id,
            status: over.data.current?.status,
            project_id: selectedProject?.id,
          }),
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        if (json) {
          setTasks(json.tasks);
        }
      } catch (e: any) {
        console.error(e.message);
      }
    }
    setActiveTask(null);
  }

  // Task status change event
  function handleDragStart(event: DragStartEvent) {
    setIsTaskDragging(true);    
    const task = tasks.find((task: TaskProps) => task.id === event.active.id) as TaskProps;
    setActiveTask(task);
  }
  
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragMove={handleDragMove}>
      <div
        ref={containerRef}
        className="flex absolute flex-row flex-grow overflow-y-hidden gap-1 overflow-x-auto p-1 w-full h-[calc(100vh-150px)] active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {selectedProject?.status ? (
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
            {selectedProject.status.map((status, index) => {
              return <TaskContainer key={index} index={index} title={status.text} id={status.id} />;
            })}
          </DndContext>
        ) : (
          <>
            <p>There are no status yet</p>
            <Button variant="secondary">Add status</Button>
          </>
        )}
      </div>
    </DndContext>
  );
};

export default StatusArea;