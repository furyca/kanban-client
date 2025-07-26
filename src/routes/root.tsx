import { Outlet } from "react-router-dom";
import ModalRenderer from "@/components/Modals/ModalRenderer";
import NavBar from "@/components/Nav/NavBar";

export default function Root() {

  return (
    <div
      className="scroll-smooth h-dvh flex flex-col overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-slate-300 p-0"
    >
      <NavBar />
      <Outlet />
      <ModalRenderer />
    </div>
  );
}
