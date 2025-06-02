import useProjectStore from "@/store/projectStore";

const ProjectSummary = () => {
  const { selectedProject } = useProjectStore();

  return (
    <div className="sticky top-0 left-0 border-b border-slate-600 p-2 h-24">
      <h1 className="font-bold text-xl">{selectedProject?.title}</h1>
      <h3 className="italic text-xs tracking-wide max-w-96 line-clamp-3">{selectedProject?.description}</h3>
    </div>
  );
};

export default ProjectSummary;
