import { Outlet } from "react-router-dom";
import ModalRenderer from "@/components/Modals/ModalRenderer";
import NavBar from "@/components/Nav/NavBar";

export default function Root() {
  return (
    <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] h-full text-slate-300 p-0 overflow-hidden">
      <NavBar />
      <Outlet />
      <ModalRenderer />
    </div>
  );
}
