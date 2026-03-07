import { useProjectIds } from "@/store/projects/project.selectors";
import ProjectCard from "./ProjectCard";
import SkeletonProjectCard from "./SkeletonProjectCard";
import useProjectStore from "@/store/projects/project.store";
import useAuthStore from "@/store/auth/auth.store";

const ProjectSelectionArea = () => {
  const projectIds = useProjectIds();
  const setSelectedProjectID = useProjectStore((s) => s.setSelectedProjectID);
  const loadingProjects = useProjectStore((s) => s.loadingProjects);
  const loadingAuth = useAuthStore((s) => s.loadingAuth);
  const loading = loadingProjects || loadingAuth;

  return (
    <div className="p-4 h-full">
      <h2 className="text-lg font-bold">Project Overview</h2>
      <div className="flex flex-wrap content-start gap-2 h-full overflow-auto pt-4 pb-24">
        {loading ? (
          <SkeletonProjectCard />
        ) : (
          projectIds.map((projectId) => (
            <ProjectCard key={projectId} projectId={projectId} onClick={() => setSelectedProjectID(projectId)} />
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectSelectionArea;
