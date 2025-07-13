import useProjectStore from "@/store/projectStore";

const ProjectSummary = () => {
  const { selectedProject } = useProjectStore();

  return (
    <div className="sticky top-0 left-0 border-b border-slate-600 p-2">
      <h1 className="font-bold text-xl">{selectedProject?.title}</h1>
      <h3
        className="w-1/2 text-xs italic tracking-wide line-clamp-2 whitespace-normal break-words overflow-hidden"
        title={selectedProject?.description}
      >
        {selectedProject?.description}
      </h3>
    </div>
  );
};

export default ProjectSummary;
