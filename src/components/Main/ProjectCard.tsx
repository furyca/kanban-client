import useProjectStore, { ProjectProps } from "@/store/projectStore";

const ProjectCard = ({ id, title, description, status }: ProjectProps) => {
  const { setSelectedProject } = useProjectStore();
  return (
    <div
      onClick={() => setSelectedProject({ title, id, description, status })}
      className="flex flex-col w-56 md:w-72 h-40 border-zinc-500 border rounded-lg p-2 cursor-pointer bg-white/10 select-none transition-all duration-200 hover:text-violet-400 hover:shadow-lg hover:-translate-y-1"
    >
      <h3 className="text-lg font-bold truncate">{title}</h3>
      <i className="text-sm line-clamp-5 break-words">{description}</i>
      <p className="text-xs font-bold mt-auto">Status size: {status?.length}</p>
    </div>
  );
};

export default ProjectCard;