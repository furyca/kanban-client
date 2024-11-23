import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import ModalRenderer from "@/components/Modals/ModalRenderer";

//tests
export default function Root() {
  return (
    <div className="bg-gray-950 min-h-dvh text-white p-0 text-base">
      <NavBar />
      <Outlet />
      <ModalRenderer />
    </div>
  );
}
