import { ChevronLeft, ChevronRight, LoaderCircle, Plus } from "lucide-react";
import { AvatarIcon } from "@radix-ui/react-icons";
import useProjectStore from "@/store/projectStore";
import useModalStore from "@/store/modalStore";
import { useState } from "react";
import SideBarButton from "./SideBarButton";
import LogOut from "./LogOut";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/userStore";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth > 768 ? false : true);
  const { projects, setSelectedProject, loadingProjects } = useProjectStore((state) => state);
  const { setModal } = useModalStore();
  const navigate = useNavigate();
  const { user } = useUserStore();

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-52"
      } border-r border-slate-600 transition-all duration-300 flex flex-col sticky top-0 justify-between  bg-zinc-900/50 h-full`}
      data-testid="sidebar"
    >
      <section className="h-full overflow-y-auto overflow-x-hidden" data-testid="sidebar-projects">
        <div
          className={`${
            collapsed && "flex-col"
          } flex justify-between items-center backdrop-blur-3xl mb-1 px-2 py-1 border-b border-zinc-700 font-bold sticky top-0`}
        >
          {!collapsed && <h1>Projects</h1>}
          <Button
            onClick={() => setSelectedProject(null)}
            className="tracking-wider underline transition-all duration-100 underline-offset-1 hover:underline-offset-2 bg-transparent hover:bg-transparent text-white py-0"
          >
            All
          </Button>
        </div>
        <div className="flex flex-col mb-14">
          {loadingProjects ? (
            <LoaderCircle className="animate-spin mx-auto mt-2" />
          ) : (
            projects.map((project, index) => {
              return <SideBarButton key={index} index={index} collapsed={collapsed} {...project} />;
            })
          )}
        </div>
      </section>
      <section
        className={`${
          collapsed && "flex flex-col"
        } bg-[#302b63] transition-all duration-300 sticky bottom-0 text-center px-1 border-t border-zinc-700`}
      >
        <Button
          onClick={() => setModal("create_project")}
          className={`mt-2 bg-blue-500 hover:bg-blue-600 w-full`}
          variant="ghost"
          data-testid="open-create-project-modal"
        >
          <Plus />
        </Button>
        <div
          className={`${collapsed && "flex-col"} transition-all duration-300 flex justify-between mb-2 overflow-hidden`}
        >
          <Button variant="ghost" className="mt-2 hover:bg-slate-300" onClick={() => navigate("/")}>
            {user?.avatar ? (
              <img src={user.avatar} alt="User Avatar" className="w-6 h-6 rounded-full" />
            ) : (
              <AvatarIcon />
            )}
          </Button>
          <LogOut />
          <Button variant="ghost" onClick={handleCollapse} className="mt-2 hover:bg-slate-300">
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
      </section>
    </aside>
  );
};

export default SideBar;
