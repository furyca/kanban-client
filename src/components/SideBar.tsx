import { ChevronLeft, Plus } from "lucide-react";
import LogOut from "./LogOut";
import SideBarButton from "./SideBarButton";
import { Button } from "./ui/button";
import { AvatarIcon } from "@radix-ui/react-icons";
import useProjectStore from "@/store/projectStore";
import useModalStore from "@/store/modalStore";

const SideBar = () => {
  const { projects } = useProjectStore((state) => state);
  const { setModal } = useModalStore();

  const handleClick = () => {
    setModal("create_project");
  };

  return (
    <aside className="flex flex-col sticky top-0 justify-between border-e-2 border-zinc-800 p-4 w-60 h-[calc(100dvh-56px)]">
      <section className="flex flex-col">
        <h1 className="mb-4 ps-2">Projects</h1>
        {projects.length > 0
          ? projects.map((project, index) => {
              return <SideBarButton key={index} {...project} />;
            })
          : null}
        {/* To the bottom */}
        <Button onClick={handleClick} className="mt-4 bg-blue-500" variant="ghost">
          <Plus />
        </Button>
      </section>
      <section className="flex gap-4 justify-center ">
        <Button variant="ghost">
          <AvatarIcon />
        </Button>
        <LogOut />
        <Button variant="ghost">
          <ChevronLeft />
        </Button>
      </section>
    </aside>
  );
};

export default SideBar;
