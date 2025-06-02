import useProjectStore from "@/store/projectStore";
import ProjectCard from "./ProjectCard";
import SkeletonProjectCard from "./SkeletonProjectCard";

const ProjectSelectionArea = () => {
  const { projects, loadingProjects } = useProjectStore();

  return (
    <div className="p-4 h-full">
      <h2 className="text-lg font-bold">Project Overview</h2>
      <div className="flex flex-wrap content-start gap-2 h-full overflow-auto pt-4 pb-24">
        {loadingProjects ? (
          <SkeletonProjectCard />
        ) : (
          projects.map(({ id, title, description, status }) => (
            <ProjectCard key={id} id={id} title={title} description={description} status={status} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectSelectionArea;
