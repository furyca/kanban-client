import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import ModalRenderer from "@/components/Modals/ModalRenderer";

export default function Root() {
  return (
    <div className="bg-gray-900 min-h-dvh text-gray-200 p-0 overflow-x-hidden">
      <NavBar />
      <Outlet />
      <ModalRenderer />
    </div>
  );
}
