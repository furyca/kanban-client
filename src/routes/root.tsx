import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import ModalRenderer from "@/components/Modals/ModalRenderer";

export default function Root() {
  return (
    <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] h-full text-slate-300 p-0 overflow-hidden">
      <NavBar />
      <Outlet />
      <ModalRenderer />
    </div>
  );
}
